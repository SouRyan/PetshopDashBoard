const API_URL = 'http://localhost:5000/api';

// Variáveis globais
let servicos = [];
let clientes = [];
let pets = [];
let servicoAtual = null;

// Carregar dados quando a página iniciar
document.addEventListener('DOMContentLoaded', async () => {
    await Promise.all([
        carregarServicos(),
        carregarClientes()
    ]);
    inicializarCalendario();
});

// Funções de carregamento de dados
async function carregarServicos() {
    try {
        console.log('Iniciando carregamento de serviços...');
        const response = await fetch(`${API_URL}/servicos`);
        
        if (!response.ok) {
            console.error('Erro na resposta:', response.status, response.statusText);
            throw new Error(`Erro ao carregar serviços: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Serviços carregados:', data);
        servicos = data;
        
        console.log('Atualizando tabela de serviços...');
        atualizarTabelaServicos();
        console.log('Tabela de serviços atualizada');
        
        console.log('Atualizando calendário...');
        atualizarCalendario();
        console.log('Calendário atualizado');
    } catch (error) {
        console.error('Erro ao carregar serviços:', error);
        alert('Erro ao carregar serviços. Verifique o console para mais detalhes.');
    }
}

async function carregarClientes() {
    try {
        console.log('Iniciando carregamento de clientes...');
        const response = await fetch(`${API_URL}/clientes`);
        if (!response.ok) {
            throw new Error(`Erro ao carregar clientes: ${response.status}`);
        }
        clientes = await response.json();
        console.log('Clientes carregados:', clientes);
        preencherSelectClientes();
    } catch (error) {
        console.error('Erro ao carregar clientes:', error);
        alert('Erro ao carregar clientes. Verifique o console para mais detalhes.');
    }
}

async function carregarPetsCliente() {
    const clienteId = document.getElementById('clienteServico').value;
    if (!clienteId) {
        console.log('Nenhum cliente selecionado');
        document.getElementById('petServico').innerHTML = '<option value="">Selecione um pet</option>';
        return;
    }

    try {
        console.log('Carregando pets do cliente:', clienteId);
        const response = await fetch(`${API_URL}/pets/cliente/${clienteId}`);
        if (!response.ok) {
            throw new Error(`Erro ao carregar pets: ${response.status}`);
        }
        pets = await response.json();
        console.log('Pets carregados:', pets);
        preencherSelectPets();
    } catch (error) {
        console.error('Erro ao carregar pets do cliente:', error);
        alert('Erro ao carregar pets do cliente. Verifique o console para mais detalhes.');
    }
}

// Funções de preenchimento de selects
function preencherSelectClientes() {
    console.log('Preenchendo select de clientes...');
    const select = document.getElementById('clienteServico');
    if (!select) {
        console.error('Elemento select de clientes não encontrado!');
        return;
    }
    
    select.innerHTML = '<option value="">Selecione um cliente</option>';
    if (!clientes || clientes.length === 0) {
        console.log('Nenhum cliente encontrado para preencher o select');
        return;
    }
    
    clientes.forEach(cliente => {
        const option = document.createElement('option');
        option.value = cliente._id;
        option.textContent = cliente.nome;
        select.appendChild(option);
    });
    console.log('Select de clientes preenchido com sucesso');
}

function preencherSelectPets() {
    console.log('Preenchendo select de pets...');
    const select = document.getElementById('petServico');
    if (!select) {
        console.error('Elemento select de pets não encontrado!');
        return;
    }

    select.innerHTML = '<option value="">Selecione um pet</option>';
    if (!pets || pets.length === 0) {
        console.log('Nenhum pet encontrado para este cliente');
        return;
    }

    pets.forEach(pet => {
        const option = document.createElement('option');
        option.value = pet._id;
        option.textContent = `${pet.nome} (${pet.especie})`;
        select.appendChild(option);
    });
    console.log('Select de pets preenchido com sucesso');
}

// Funções de atualização da interface
function atualizarTabelaServicos() {
    console.log('Iniciando atualização da tabela de serviços...');
    const tbody = document.getElementById('tabelaServicos');
    if (!tbody) {
        console.error('Elemento tbody não encontrado!');
        return;
    }

    tbody.innerHTML = '';
    console.log('Total de serviços:', servicos.length);

    const servicosFiltrados = filtrarServicos();
    console.log('Serviços filtrados:', servicosFiltrados.length);
    
    if (servicosFiltrados.length === 0) {
        const tr = document.createElement('tr');
        tr.innerHTML = '<td colspan="7" class="text-center">Nenhum serviço encontrado</td>';
        tbody.appendChild(tr);
        return;
    }

    servicosFiltrados.forEach(servico => {
        console.log('Processando serviço:', servico);

        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${formatarDataHora(servico.dataHora)}</td>
            <td>${servico.cliente ? servico.cliente.nome : 'N/A'}</td>
            <td>${servico.pet ? servico.pet.nome : 'N/A'}</td>
            <td>${servico.tipo}</td>
            <td><span class="badge bg-${getStatusColor(servico.status)}">${servico.status}</span></td>
            <td>R$ ${servico.preco ? servico.preco.toFixed(2) : '0.00'}</td>
            <td>
                <button class="btn btn-sm btn-primary me-1" onclick="editarServico('${servico._id}')">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-sm btn-danger me-1" onclick="excluirServico('${servico._id}')">
                    <i class="fas fa-trash"></i>
                </button>
                <button class="btn btn-sm btn-success" onclick="atualizarStatus('${servico._id}')">
                    <i class="fas fa-check"></i>
                </button>
            </td>
        `;
        tbody.appendChild(tr);
    });
    console.log('Tabela de serviços atualizada com sucesso');
}

function filtrarServicos() {
    const dataInicio = document.getElementById('dataInicio').value;
    const dataFim = document.getElementById('dataFim').value;
    const status = document.getElementById('status').value;

    return servicos.filter(servico => {
        // Não mostrar serviços finalizados na tabela principal
        if (servico.status === 'finalizado') return false;

        const dataServico = new Date(servico.dataHora);
        const atendeDatas = (!dataInicio || dataServico >= new Date(dataInicio)) &&
                           (!dataFim || dataServico <= new Date(dataFim));
        const atendeStatus = !status || servico.status === status;
        
        return atendeDatas && atendeStatus;
    });
}

// Funções de manipulação de serviços
async function salvarServico() {
    const form = document.getElementById('formServico');
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }

    const servico = {
        cliente: document.getElementById('clienteServico').value,
        pet: document.getElementById('petServico').value,
        tipo: document.getElementById('tipoServico').value,
        dataHora: `${document.getElementById('dataServico').value}T${document.getElementById('horaServico').value}`,
        preco: parseFloat(document.getElementById('precoServico').value),
        observacoes: document.getElementById('observacoesServico').value,
        status: 'agendado'
    };

    try {
        const url = servicoAtual ? 
            `${API_URL}/servicos/${servicoAtual}` : 
            `${API_URL}/servicos`;
        
        const response = await fetch(url, {
            method: servicoAtual ? 'PUT' : 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(servico)
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Erro ao salvar serviço');
        }

        await carregarServicos();
        bootstrap.Modal.getInstance(document.getElementById('modalServico')).hide();
        limparFormulario();
        alert('Serviço salvo com sucesso!');
    } catch (error) {
        console.error('Erro:', error);
        alert(error.message || 'Erro ao salvar serviço');
    }
}

async function editarServico(id) {
    try {
        const response = await fetch(`${API_URL}/servicos/${id}`);
        if (!response.ok) throw new Error('Erro ao carregar serviço');
        
        const servico = await response.json();
        servicoAtual = id;

        const dataHora = new Date(servico.dataHora);
        
        document.getElementById('clienteServico').value = servico.cliente._id;
        await carregarPetsCliente();
        document.getElementById('petServico').value = servico.pet._id;
        document.getElementById('tipoServico').value = servico.tipo;
        document.getElementById('dataServico').value = dataHora.toISOString().split('T')[0];
        document.getElementById('horaServico').value = dataHora.toTimeString().slice(0, 5);
        document.getElementById('precoServico').value = servico.preco;
        document.getElementById('observacoesServico').value = servico.observacoes;

        document.getElementById('modalServicoTitle').textContent = 'Editar Agendamento';
        new bootstrap.Modal(document.getElementById('modalServico')).show();
    } catch (error) {
        console.error('Erro:', error);
        alert('Erro ao carregar serviço para edição');
    }
}

async function excluirServico(id) {
    if (!confirm('Tem certeza que deseja excluir este agendamento?')) return;

    try {
        const response = await fetch(`${API_URL}/servicos/${id}`, {
            method: 'DELETE'
        });

        if (!response.ok) throw new Error('Erro ao excluir serviço');
        await carregarServicos();
    } catch (error) {
        console.error('Erro:', error);
        alert('Erro ao excluir serviço');
    }
}

async function atualizarStatus(id) {
    try {
        const servico = servicos.find(s => s._id === id);
        if (!servico) throw new Error('Serviço não encontrado');

        const novoStatus = getProximoStatus(servico.status);
        
        if (servico.status === 'concluido') {
            if (!confirm('O serviço foi realmente finalizado? Ele será movido para o histórico.')) {
                return;
            }
            
            // Finaliza o serviço
            const response = await fetch(`${API_URL}/servicos/${id}/finalizar`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' }
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Erro ao finalizar serviço');
            }

            await carregarServicos();
            alert('Serviço finalizado com sucesso!');
            return;
        }

        // Atualização normal de status
        const response = await fetch(`${API_URL}/servicos/${id}/status`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: novoStatus })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Erro ao atualizar status');
        }
        
        await carregarServicos();
    } catch (error) {
        console.error('Erro:', error);
        alert(error.message || 'Erro ao atualizar status do serviço');
    }
}

// Funções utilitárias
function formatarDataHora(dataHora) {
    const data = new Date(dataHora);
    return data.toLocaleString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

function getStatusColor(status) {
    const cores = {
        'agendado': 'warning',
        'em_andamento': 'primary',
        'concluido': 'success',
        'cancelado': 'danger',
        'finalizado': 'info'
    };
    return cores[status] || 'secondary';
}

function getProximoStatus(statusAtual) {
    const fluxo = {
        'agendado': 'em_andamento',
        'em_andamento': 'concluido',
        'concluido': 'finalizado',
        'cancelado': 'agendado',
        'finalizado': 'agendado'
    };
    return fluxo[statusAtual] || 'agendado';
}

function limparFormulario() {
    document.getElementById('formServico').reset();
    servicoAtual = null;
    document.getElementById('modalServicoTitle').textContent = 'Novo Agendamento';
}

// Event Listeners
document.getElementById('modalServico').addEventListener('show.bs.modal', (event) => {
    if (!event.relatedTarget) return; // Não é um novo agendamento
    limparFormulario();
});

// Funções de utilidade
const formatarData = (data) => {
    return new Date(data).toLocaleDateString('pt-BR');
};

const formatarHora = (data) => {
    return new Date(data).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
};

const formatarMoeda = (valor) => {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(valor);
};

// Funções do calendário
function inicializarCalendario() {
    // Aqui você pode implementar a lógica do calendário
    console.log('Calendário inicializado');
}

function atualizarCalendario() {
    // Atualizar eventos no calendário
    console.log('Calendário atualizado');
}

// Funções do histórico de serviços
async function carregarHistoricoServicos(clienteId, petId) {
    try {
        console.log('Carregando histórico de serviços...');
        const response = await fetch(`${API_URL}/servicos/historico/${clienteId}/${petId}`);
        
        if (!response.ok) {
            throw new Error(`Erro ao carregar histórico: ${response.status}`);
        }
        
        const historico = await response.json();
        console.log('Histórico carregado:', historico);
        atualizarTabelaHistorico(historico);
    } catch (error) {
        console.error('Erro ao carregar histórico:', error);
        alert('Erro ao carregar histórico de serviços. Verifique o console para mais detalhes.');
    }
}

function atualizarTabelaHistorico(historico) {
    console.log('Atualizando tabela de histórico...');
    const tbody = document.getElementById('tabelaHistorico');
    if (!tbody) {
        console.error('Elemento tbody do histórico não encontrado!');
        return;
    }

    tbody.innerHTML = '';
    console.log('Total de registros no histórico:', historico.length);
    
    if (historico.length === 0) {
        const tr = document.createElement('tr');
        tr.innerHTML = '<td colspan="7" class="text-center">Nenhum histórico encontrado</td>';
        tbody.appendChild(tr);
        return;
    }

    historico.forEach(servico => {
        console.log('Processando registro do histórico:', servico);

        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${formatarDataHora(servico.dataHora)}</td>
            <td>${servico.tipo}</td>
            <td><span class="badge bg-${getStatusColor(servico.status)}">${servico.status}</span></td>
            <td>R$ ${servico.preco ? servico.preco.toFixed(2) : '0.00'}</td>
            <td>${servico.observacoes || '-'}</td>
            <td>
                <button class="btn btn-sm btn-primary me-1" onclick="editarServico('${servico._id}')">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-sm btn-success" onclick="atualizarStatus('${servico._id}')">
                    <i class="fas fa-check"></i>
                </button>
            </td>
        `;
        tbody.appendChild(tr);
    });
    console.log('Tabela de histórico atualizada com sucesso');
}

// Adicionar evento para carregar histórico quando selecionar cliente e pet
document.getElementById('clienteServico').addEventListener('change', async () => {
    const clienteId = document.getElementById('clienteServico').value;
    if (clienteId) {
        await carregarPetsCliente();
        const petId = document.getElementById('petServico').value;
        if (petId) {
            await carregarHistoricoServicos(clienteId, petId);
        }
    }
});

document.getElementById('petServico').addEventListener('change', async () => {
    const clienteId = document.getElementById('clienteServico').value;
    const petId = document.getElementById('petServico').value;
    if (clienteId && petId) {
        await carregarHistoricoServicos(clienteId, petId);
    }
});

// Função para carregar histórico de serviços finalizados
async function carregarHistoricoFinalizados() {
    try {
        const response = await fetch(`${API_URL}/servicos/historico/finalizados`);
        if (!response.ok) throw new Error('Erro ao carregar histórico');
        
        const historico = await response.json();
        const tbody = document.getElementById('historicoServicos');
        tbody.innerHTML = '';

        if (historico.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" class="text-center">Nenhum serviço finalizado</td></tr>';
            return;
        }

        historico.forEach(servico => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${formatarDataHora(servico.dataHora)}</td>
                <td>${servico.cliente ? servico.cliente.nome : 'N/A'}</td>
                <td>${servico.pet ? servico.pet.nome : 'N/A'}</td>
                <td>${servico.tipo}</td>
                <td>R$ ${servico.preco.toFixed(2)}</td>
                <td>${servico.observacoes || '-'}</td>
            `;
            tbody.appendChild(tr);
        });
    } catch (error) {
        console.error('Erro ao carregar histórico:', error);
        const tbody = document.getElementById('historicoServicos');
        tbody.innerHTML = '<tr><td colspan="6" class="text-center">Erro ao carregar histórico</td></tr>';
    }
}

// Adicionar evento para o botão de histórico
document.getElementById('btnHistorico').addEventListener('click', () => {
    carregarHistoricoFinalizados();
    new bootstrap.Modal(document.getElementById('modalHistorico')).show();
}); 