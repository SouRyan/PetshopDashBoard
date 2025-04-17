// Funções de inicialização
document.addEventListener('DOMContentLoaded', () => {
    console.log('Iniciando carregamento do dashboard...');
    carregarVendasDoDia();
});

// Funções de carregamento de dados
async function carregarVendasDoDia() {
    try {
        console.log('Fazendo requisição para /api/vendas/hoje...');
        const response = await fetch('/api/vendas/hoje');
        
        if (!response.ok) {
            console.error('Resposta não ok:', response.status, response.statusText);
            throw new Error('Erro ao carregar vendas');
        }
        
        console.log('Resposta recebida, convertendo para JSON...');
        const dados = await response.json();
        console.log('Dados recebidos:', dados);
        
        atualizarDashboardVendas(dados);
        atualizarTabelaVendas(dados.vendas);
        console.log('Dashboard atualizado com sucesso!');
    } catch (error) {
        console.error('Erro detalhado:', error);
        document.getElementById('totalVendasDia').textContent = 'Erro ao carregar';
        document.getElementById('quantidadeVendasDia').textContent = '-';
        document.getElementById('tabelaVendas').innerHTML = `
            <tr>
                <td colspan="5" class="text-center text-danger">
                    Erro ao carregar vendas. Por favor, recarregue a página.
                </td>
            </tr>
        `;
    }
}

// Funções de atualização da interface
function atualizarDashboardVendas(dados) {
    console.log('Atualizando dashboard com dados:', dados);
    if (!dados) {
        console.error('Dados inválidos recebidos');
        return;
    }

    const totalElement = document.getElementById('totalVendasDia');
    const quantidadeElement = document.getElementById('quantidadeVendasDia');

    if (!totalElement || !quantidadeElement) {
        console.error('Elementos do dashboard não encontrados');
        return;
    }

    totalElement.textContent = `R$ ${(dados.totalDia || 0).toFixed(2)}`;
    quantidadeElement.textContent = dados.quantidadeVendas || 0;
}

function atualizarTabelaVendas(vendas) {
    console.log('Atualizando tabela com vendas:', vendas);
    const tbody = document.getElementById('tabelaVendas');
    if (!tbody) {
        console.error('Elemento tabelaVendas não encontrado');
        return;
    }

    tbody.innerHTML = '';

    if (!vendas || vendas.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="5" class="text-center">
                    Nenhuma venda registrada hoje
                </td>
            </tr>
        `;
        return;
    }

    vendas.forEach(venda => {
        if (!venda) return;
        
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${formatarData(venda.data)}</td>
            <td>${venda.itens ? venda.itens.length : 0}</td>
            <td>
                ${venda.itens ? venda.itens.map(item => 
                    item.produto ? `${item.produto.nome} (${item.quantidade})` : ''
                ).filter(Boolean).join('<br>') : ''}
            </td>
            <td>R$ ${(venda.total || 0).toFixed(2)}</td>
            <td>
                <button class="btn btn-sm btn-info" onclick="verDetalhesVenda('${venda._id}')">
                    <i class="fas fa-eye"></i>
                </button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// Funções de utilidade
function formatarData(data) {
    if (!data) return '-';
    try {
        return new Date(data).toLocaleString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    } catch (error) {
        console.error('Erro ao formatar data:', error);
        return '-';
    }
}

// Funções de modal
function verDetalhesVenda(id) {
    console.log('Visualizando detalhes da venda:', id);
    // Implementar visualização detalhada da venda
} 