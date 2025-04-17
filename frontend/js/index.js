const API_URL = 'http://localhost:5000/api';

// Carregar dados quando a página iniciar
document.addEventListener('DOMContentLoaded', async () => {
    await Promise.all([
        carregarDashboard(),
        carregarProximosAgendamentos(),
        carregarProdutosBaixoEstoque()
    ]);

    // Inicializar estado dos valores ocultos
    const valoresOcultos = JSON.parse(localStorage.getItem('valoresOcultos')) || {};
    Object.keys(valoresOcultos).forEach(id => {
        if (valoresOcultos[id]) {
            ocultarValor(id);
        }
    });
});

async function carregarDashboard() {
    try {
        // Carregar totais
        const [clientes, pets, servicos, vendas] = await Promise.all([
            fetch(`${API_URL}/clientes`).then(res => res.json()),
            fetch(`${API_URL}/pets`).then(res => res.json()),
            fetch(`${API_URL}/servicos`).then(res => res.json()),
            fetch(`${API_URL}/vendas`).then(res => res.json())
        ]);

        // Atualizar cards
        document.getElementById('totalClientes').textContent = clientes.length;
        document.getElementById('totalPets').textContent = pets.length;

        // Calcular serviços do dia
        const hoje = new Date();
        hoje.setHours(0, 0, 0, 0);
        const servicosHoje = servicos.filter(servico => {
            const dataServico = new Date(servico.dataHora);
            return dataServico >= hoje && dataServico < new Date(hoje.getTime() + 24 * 60 * 60 * 1000);
        });
        document.getElementById('servicosHoje').textContent = servicosHoje.length;

        // Calcular vendas do dia
        const vendasHoje = vendas.filter(venda => {
            const dataVenda = new Date(venda.data);
            return dataVenda >= hoje && dataVenda < new Date(hoje.getTime() + 24 * 60 * 60 * 1000);
        });
        const totalVendasHoje = vendasHoje.reduce((total, venda) => total + venda.total, 0);
        document.getElementById('vendasDia').textContent = formatarMoeda(totalVendasHoje);

        // Calcular serviços finalizados no mês
        const inicioMes = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
        const fimMes = new Date(hoje.getFullYear(), hoje.getMonth() + 1, 0, 23, 59, 59, 999);
        
        console.log('Calculando serviços finalizados...');
        console.log('Início do mês:', inicioMes);
        console.log('Fim do mês:', fimMes);
        
        const servicosFinalizadosMes = servicos.filter(servico => {
            const dataServico = new Date(servico.dataHora);
            const estaNoMes = dataServico >= inicioMes && dataServico <= fimMes;
            const estaFinalizado = servico.status === 'finalizado';
            
            console.log('Serviço:', {
                id: servico._id,
                data: dataServico,
                status: servico.status,
                estaNoMes,
                estaFinalizado,
                preco: servico.preco
            });
            
            return estaNoMes && estaFinalizado;
        });

        console.log('Serviços finalizados encontrados:', servicosFinalizadosMes.length);
        
        const totalServicosFinalizadosMes = servicosFinalizadosMes.reduce((total, servico) => {
            console.log('Somando serviço:', {
                id: servico._id,
                preco: servico.preco,
                totalAcumulado: total + servico.preco
            });
            return total + (servico.preco || 0);
        }, 0);

        console.log('Total calculado:', totalServicosFinalizadosMes);
        
        document.getElementById('servicosFinalizadosMes').textContent = formatarMoeda(totalServicosFinalizadosMes);
        document.getElementById('qtdServicosFinalizadosMes').textContent = 
            `${servicosFinalizadosMes.length} serviço${servicosFinalizadosMes.length !== 1 ? 's' : ''}`;

    } catch (error) {
        console.error('Erro ao carregar dashboard:', error);
        alert('Erro ao carregar informações do dashboard');
    }
}

async function carregarProximosAgendamentos() {
    try {
        const response = await fetch(`${API_URL}/servicos`);
        if (!response.ok) throw new Error('Erro ao carregar serviços');
        
        const servicos = await response.json();
        
        // Filtrar próximos agendamentos (agendamentos futuros e não finalizados)
        const agora = new Date();
        const proximosAgendamentos = servicos
            .filter(servico => 
                new Date(servico.dataHora) >= agora && 
                servico.status !== 'finalizado'
            )
            .sort((a, b) => new Date(a.dataHora) - new Date(b.dataHora))
            .slice(0, 5); // Pegar apenas os 5 próximos

        const tbody = document.getElementById('proximosAgendamentos');
        tbody.innerHTML = '';

        if (proximosAgendamentos.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5" class="text-center">Nenhum agendamento próximo</td></tr>';
            return;
        }

        proximosAgendamentos.forEach(servico => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${formatarDataHora(servico.dataHora)}</td>
                <td>${servico.cliente ? servico.cliente.nome : 'N/A'}</td>
                <td>${servico.pet ? servico.pet.nome : 'N/A'}</td>
                <td>${servico.tipo}</td>
                <td><span class="badge bg-${getStatusColor(servico.status)}">${servico.status}</span></td>
            `;
            tbody.appendChild(tr);
        });
    } catch (error) {
        console.error('Erro ao carregar próximos agendamentos:', error);
        const tbody = document.getElementById('proximosAgendamentos');
        tbody.innerHTML = '<tr><td colspan="5" class="text-center">Erro ao carregar agendamentos</td></tr>';
    }
}

async function carregarProdutosBaixoEstoque() {
    try {
        const response = await fetch(`${API_URL}/produtos/baixo-estoque`);
        if (!response.ok) throw new Error('Erro ao carregar produtos');
        
        const produtos = await response.json();
        const tbody = document.getElementById('produtosBaixoEstoque');
        tbody.innerHTML = '';

        if (produtos.length === 0) {
            tbody.innerHTML = '<tr><td colspan="4" class="text-center">Nenhum produto com estoque baixo</td></tr>';
            return;
        }

        produtos.forEach(produto => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${produto.nome}</td>
                <td>${produto.quantidadeAtual}</td>
                <td>${produto.quantidadeMinima}</td>
                <td><span class="badge bg-${produto.quantidadeAtual === 0 ? 'danger' : 'warning'}">${produto.quantidadeAtual === 0 ? 'Sem estoque' : 'Estoque baixo'}</span></td>
            `;
            tbody.appendChild(tr);
        });
    } catch (error) {
        console.error('Erro ao carregar produtos com estoque baixo:', error);
        const tbody = document.getElementById('produtosBaixoEstoque');
        tbody.innerHTML = '<tr><td colspan="4" class="text-center">Erro ao carregar produtos</td></tr>';
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

function formatarMoeda(valor) {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(valor);
}

function getStatusColor(status) {
    const cores = {
        'agendado': 'warning',
        'em_andamento': 'primary',
        'concluido': 'success',
        'cancelado': 'danger'
    };
    return cores[status] || 'secondary';
}

// Funções para ocultar/mostrar valores
function toggleValor(id) {
    const elemento = document.getElementById(id);
    const icon = document.getElementById(`icon${id.charAt(0).toUpperCase() + id.slice(1)}`);
    const valoresOcultos = JSON.parse(localStorage.getItem('valoresOcultos')) || {};

    if (elemento.style.visibility === 'hidden') {
        // Mostrar valor
        elemento.style.visibility = 'visible';
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
        valoresOcultos[id] = false;
    } else {
        // Ocultar valor
        ocultarValor(id);
        valoresOcultos[id] = true;
    }

    localStorage.setItem('valoresOcultos', JSON.stringify(valoresOcultos));
}

function ocultarValor(id) {
    const elemento = document.getElementById(id);
    const icon = document.getElementById(`icon${id.charAt(0).toUpperCase() + id.slice(1)}`);
    
    elemento.style.visibility = 'hidden';
    icon.classList.remove('fa-eye');
    icon.classList.add('fa-eye-slash');
} 