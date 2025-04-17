// Configuração da API
const API_URL = 'http://localhost:5000/api';

// Funções de utilidade
const formatarMoeda = (valor) => {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(valor);
};

const formatarData = (data) => {
    return new Date(data).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
};

// Funções para carregar dados do dashboard
async function carregarDashboard() {
    try {
        await Promise.all([
            carregarTotais(),
            carregarAgendamentos(),
            carregarEstoqueBaixo()
        ]);
    } catch (error) {
        console.error('Erro ao carregar dashboard:', error);
        alert('Erro ao carregar informações do dashboard');
    }
}

// Carregar totais
async function carregarTotais() {
    try {
        const [clientes, agendamentos, produtos, vendas] = await Promise.all([
            fetch(`${API_URL}/clientes`).then(res => res.json()),
            fetch(`${API_URL}/servicos`).then(res => res.json()),
            fetch(`${API_URL}/produtos`).then(res => res.json()),
            fetch(`${API_URL}/vendas`).then(res => res.json())
        ]);

        document.getElementById('totalClientes').textContent = clientes.length;
        document.getElementById('totalAgendamentos').textContent = agendamentos.filter(a => a.status === 'agendado').length;
        document.getElementById('totalProdutos').textContent = produtos.length;

        const vendasHoje = vendas.filter(v => {
            const dataVenda = new Date(v.dataCriacao);
            const hoje = new Date();
            return dataVenda.toDateString() === hoje.toDateString();
        });

        const totalVendasHoje = vendasHoje.reduce((total, venda) => total + venda.total, 0);
        document.getElementById('vendasHoje').textContent = formatarMoeda(totalVendasHoje);

    } catch (error) {
        console.error('Erro ao carregar totais:', error);
    }
}

// Carregar próximos agendamentos
async function carregarAgendamentos() {
    try {
        const response = await fetch(`${API_URL}/servicos?status=agendado`);
        const agendamentos = await response.json();

        const tabelaAgendamentos = document.getElementById('tabelaAgendamentos');
        tabelaAgendamentos.innerHTML = '';

        agendamentos
            .sort((a, b) => new Date(a.dataAgendamento) - new Date(b.dataAgendamento))
            .slice(0, 5)
            .forEach(agendamento => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${formatarData(agendamento.dataAgendamento)}</td>
                    <td>${agendamento.cliente.nome}</td>
                    <td>${agendamento.pet.nome}</td>
                    <td>${agendamento.tipo}</td>
                `;
                tabelaAgendamentos.appendChild(tr);
            });
    } catch (error) {
        console.error('Erro ao carregar agendamentos:', error);
    }
}

// Carregar produtos com estoque baixo
async function carregarEstoqueBaixo() {
    try {
        const response = await fetch(`${API_URL}/produtos`);
        const produtos = await response.json();

        const tabelaEstoqueBaixo = document.getElementById('tabelaEstoqueBaixo');
        tabelaEstoqueBaixo.innerHTML = '';

        produtos
            .filter(produto => produto.estoque.quantidade <= produto.estoque.minimo)
            .forEach(produto => {
                const tr = document.createElement('tr');
                const status = produto.estoque.quantidade === 0 ? 'Sem estoque' : 'Estoque baixo';
                const statusClass = produto.estoque.quantidade === 0 ? 'danger' : 'warning';

                tr.innerHTML = `
                    <td>${produto.nome}</td>
                    <td>${produto.estoque.quantidade}</td>
                    <td>${produto.estoque.minimo}</td>
                    <td><span class="badge bg-${statusClass}">${status}</span></td>
                `;
                tabelaEstoqueBaixo.appendChild(tr);
            });
    } catch (error) {
        console.error('Erro ao carregar produtos com estoque baixo:', error);
    }
}

// Inicializar dashboard quando a página carregar
document.addEventListener('DOMContentLoaded', carregarDashboard); 