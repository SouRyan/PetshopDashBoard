const API_URL = 'http://localhost:5000/api';

// Carregar dados quando a página iniciar
document.addEventListener('DOMContentLoaded', async () => {
    await Promise.all([
        carregarTotais(),
        carregarAgendamentos(),
        carregarEstoqueBaixo()
    ]);
});

// Carregar totais para os cards
async function carregarTotais() {
    try {
        const [clientes, pets, servicos, vendas] = await Promise.all([
            fetch(`${API_URL}/clientes`).then(res => res.json()),
            fetch(`${API_URL}/pets`).then(res => res.json()),
            fetch(`${API_URL}/servicos`).then(res => res.json()),
            fetch(`${API_URL}/vendas`).then(res => res.json())
        ]);

        document.getElementById('totalClientes').textContent = clientes.length;
        document.getElementById('totalPets').textContent = pets.length;

        // Filtrar serviços de hoje
        const hoje = new Date().toISOString().split('T')[0];
        const servicosHoje = servicos.filter(servico => 
            servico.dataHora.startsWith(hoje)
        );
        document.getElementById('servicosHoje').textContent = servicosHoje.length;

        // Calcular vendas do dia
        const vendasHoje = vendas
            .filter(venda => venda.data.startsWith(hoje))
            .reduce((total, venda) => total + venda.valor, 0);
        document.getElementById('vendasHoje').textContent = 
            formatarMoeda(vendasHoje);

    } catch (error) {
        console.error('Erro ao carregar totais:', error);
    }
}

// Carregar próximos agendamentos
async function carregarAgendamentos() {
    try {
        const response = await fetch(`${API_URL}/servicos`);
        const servicos = await response.json();

        // Filtrar apenas serviços futuros e ordenar por data
        const agendamentosFuturos = servicos
            .filter(servico => new Date(servico.dataHora) > new Date())
            .sort((a, b) => new Date(a.dataHora) - new Date(b.dataHora))
            .slice(0, 5); // Mostrar apenas os 5 próximos

        const tbody = document.getElementById('tabelaAgendamentos');
        tbody.innerHTML = '';

        for (const servico of agendamentosFuturos) {
            const cliente = await fetch(`${API_URL}/clientes/${servico.clienteId}`).then(res => res.json());
            const pet = await fetch(`${API_URL}/pets/${servico.petId}`).then(res => res.json());

            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${formatarDataHora(servico.dataHora)}</td>
                <td>${cliente.nome}</td>
                <td>${pet.nome}</td>
                <td>${servico.tipo}</td>
                <td><span class="badge bg-${getStatusColor(servico.status)}">${servico.status}</span></td>
            `;
            tbody.appendChild(tr);
        }
    } catch (error) {
        console.error('Erro ao carregar agendamentos:', error);
    }
}

// Carregar produtos com estoque baixo
async function carregarEstoqueBaixo() {
    try {
        const response = await fetch(`${API_URL}/produtos`);
        const produtos = await response.json();

        // Filtrar produtos com estoque baixo
        const produtosBaixos = produtos
            .filter(produto => produto.quantidade <= produto.minimo)
            .sort((a, b) => a.quantidade - b.quantidade);

        const tbody = document.getElementById('tabelaEstoqueBaixo');
        tbody.innerHTML = '';

        produtosBaixos.forEach(produto => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${produto.nome}</td>
                <td>${produto.quantidade}</td>
                <td>${produto.minimo}</td>
                <td><span class="badge bg-${getEstoqueStatusColor(produto.quantidade, produto.minimo)}">
                    ${getEstoqueStatus(produto.quantidade, produto.minimo)}
                </span></td>
            `;
            tbody.appendChild(tr);
        });
    } catch (error) {
        console.error('Erro ao carregar produtos:', error);
    }
}

// Funções auxiliares
function formatarDataHora(dataHora) {
    return new Date(dataHora).toLocaleString('pt-BR', {
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

function getEstoqueStatusColor(quantidade, minimo) {
    if (quantidade === 0) return 'danger';
    if (quantidade <= minimo / 2) return 'danger';
    if (quantidade <= minimo) return 'warning';
    return 'success';
}

function getEstoqueStatus(quantidade, minimo) {
    if (quantidade === 0) return 'ESGOTADO';
    if (quantidade <= minimo / 2) return 'CRÍTICO';
    if (quantidade <= minimo) return 'BAIXO';
    return 'OK';
} 