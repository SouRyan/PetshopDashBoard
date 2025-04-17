const API_URL = 'http://localhost:5000/api';

// Variáveis globais
let clientes = [];
let clienteAtual = null;

// Carregar dados quando a página iniciar
document.addEventListener('DOMContentLoaded', () => {
    carregarClientes();
});

// Carregar lista de clientes
async function carregarClientes() {
    try {
        const response = await fetch(`${API_URL}/clientes`);
        clientes = await response.json();
        atualizarTabelaClientes();
    } catch (error) {
        console.error('Erro ao carregar clientes:', error);
        alert('Erro ao carregar lista de clientes');
    }
}

// Atualizar tabela de clientes
function atualizarTabelaClientes() {
    const tbody = document.getElementById('tabelaClientes');
    tbody.innerHTML = '';

    clientes.forEach(cliente => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${cliente.nome}</td>
            <td>${formatarCPF(cliente.cpf)}</td>
            <td>${cliente.email}</td>
            <td>${formatarTelefone(cliente.telefone)}</td>
            <td>${cliente.endereco?.cidade || '-'}</td>
            <td>
                <button class="btn btn-sm btn-info" onclick="verPets('${cliente._id}')">
                    <i class="fas fa-dog"></i>
                </button>
            </td>
            <td>
                <button class="btn btn-sm btn-primary me-1" onclick="editarCliente('${cliente._id}')">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-sm btn-danger" onclick="excluirCliente('${cliente._id}')">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// Filtrar clientes
function filtrarClientes() {
    const busca = document.getElementById('busca').value.toLowerCase();
    
    const clientesFiltrados = clientes.filter(cliente => 
        cliente.nome.toLowerCase().includes(busca) ||
        cliente.cpf.includes(busca) ||
        cliente.email.toLowerCase().includes(busca)
    );

    clientes = clientesFiltrados;
    atualizarTabelaClientes();
}

// Salvar cliente
async function salvarCliente() {
    const form = document.getElementById('formCliente');
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }

    const cliente = {
        nome: document.getElementById('nome').value,
        cpf: document.getElementById('cpf').value.replace(/\D/g, ''),
        email: document.getElementById('email').value,
        telefone: document.getElementById('telefone').value.replace(/\D/g, ''),
        endereco: {
            rua: document.getElementById('rua').value,
            numero: document.getElementById('numero').value,
            complemento: document.getElementById('complemento').value,
            bairro: document.getElementById('bairro').value,
            cidade: document.getElementById('cidade').value,
            estado: document.getElementById('estado').value,
            cep: document.getElementById('cep').value.replace(/\D/g, '')
        }
    };

    try {
        const url = clienteAtual ? 
            `${API_URL}/clientes/${clienteAtual}` : 
            `${API_URL}/clientes`;
        
        const response = await fetch(url, {
            method: clienteAtual ? 'PUT' : 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(cliente)
        });

        if (!response.ok) {
            throw new Error('Erro ao salvar cliente');
        }

        await carregarClientes();
        limparFormulario();
        bootstrap.Modal.getInstance(document.getElementById('modalCliente')).hide();
        
        alert(clienteAtual ? 'Cliente atualizado com sucesso!' : 'Cliente cadastrado com sucesso!');
        clienteAtual = null;

    } catch (error) {
        console.error('Erro ao salvar cliente:', error);
        alert('Erro ao salvar cliente');
    }
}

// Editar cliente
async function editarCliente(id) {
    try {
        const response = await fetch(`${API_URL}/clientes/${id}`);
        const cliente = await response.json();

        clienteAtual = id;
        
        document.getElementById('nome').value = cliente.nome;
        document.getElementById('cpf').value = formatarCPF(cliente.cpf);
        document.getElementById('email').value = cliente.email;
        document.getElementById('telefone').value = formatarTelefone(cliente.telefone);
        
        if (cliente.endereco) {
            document.getElementById('rua').value = cliente.endereco.rua || '';
            document.getElementById('numero').value = cliente.endereco.numero || '';
            document.getElementById('complemento').value = cliente.endereco.complemento || '';
            document.getElementById('bairro').value = cliente.endereco.bairro || '';
            document.getElementById('cidade').value = cliente.endereco.cidade || '';
            document.getElementById('estado').value = cliente.endereco.estado || '';
            document.getElementById('cep').value = formatarCEP(cliente.endereco.cep || '');
        }

        document.getElementById('modalClienteTitle').textContent = 'Editar Cliente';
        new bootstrap.Modal(document.getElementById('modalCliente')).show();

    } catch (error) {
        console.error('Erro ao carregar cliente:', error);
        alert('Erro ao carregar dados do cliente');
    }
}

// Excluir cliente
async function excluirCliente(id) {
    if (!confirm('Tem certeza que deseja excluir este cliente?')) {
        return;
    }

    try {
        const response = await fetch(`${API_URL}/clientes/${id}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            throw new Error('Erro ao excluir cliente');
        }

        await carregarClientes();
        alert('Cliente excluído com sucesso!');

    } catch (error) {
        console.error('Erro ao excluir cliente:', error);
        alert('Erro ao excluir cliente');
    }
}

// Ver pets do cliente
async function verPets(clienteId) {
    window.location.href = `pets.html?cliente=${clienteId}`;
}

// Funções auxiliares
function formatarCPF(cpf) {
    cpf = cpf.replace(/\D/g, '');
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
}

function formatarTelefone(telefone) {
    telefone = telefone.replace(/\D/g, '');
    return telefone.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
}

function formatarCEP(cep) {
    cep = cep.replace(/\D/g, '');
    return cep.replace(/(\d{5})(\d{3})/, '$1-$2');
}

function limparFormulario() {
    document.getElementById('formCliente').reset();
    clienteAtual = null;
    document.getElementById('modalClienteTitle').textContent = 'Novo Cliente';
}

// Event Listeners
document.getElementById('modalCliente').addEventListener('show.bs.modal', (event) => {
    if (!event.relatedTarget) return; // Não é um novo cliente
    limparFormulario();
});

// Máscaras para os campos
document.getElementById('cpf').addEventListener('input', function(e) {
    let cpf = e.target.value.replace(/\D/g, '');
    if (cpf.length > 11) cpf = cpf.slice(0, 11);
    e.target.value = formatarCPF(cpf);
});

document.getElementById('telefone').addEventListener('input', function(e) {
    let telefone = e.target.value.replace(/\D/g, '');
    if (telefone.length > 11) telefone = telefone.slice(0, 11);
    e.target.value = formatarTelefone(telefone);
});

document.getElementById('cep').addEventListener('input', function(e) {
    let cep = e.target.value.replace(/\D/g, '');
    if (cep.length > 8) cep = cep.slice(0, 8);
    e.target.value = formatarCEP(cep);
}); 