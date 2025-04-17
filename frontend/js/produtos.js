// Variáveis globais
let produtos = [];
let produtoSelecionado = null;
let itensVenda = [];

// Funções de inicialização
document.addEventListener('DOMContentLoaded', () => {
    carregarProdutos();
});

// Funções de carregamento de dados
async function carregarProdutos() {
    try {
        const response = await fetch('/api/produtos');
        if (!response.ok) throw new Error('Erro ao carregar produtos');
        produtos = await response.json();
        atualizarTabelaProdutos();
        atualizarSelectProdutos();
    } catch (error) {
        console.error('Erro:', error);
        alert('Erro ao carregar produtos. Por favor, tente novamente.');
    }
}

// Funções de atualização da interface
function atualizarTabelaProdutos() {
    const tbody = document.getElementById('tabelaProdutos');
    tbody.innerHTML = '';

    produtos.forEach(produto => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${produto.nome}</td>
            <td>${formatarCategoria(produto.categoria)}</td>
            <td>R$ ${produto.preco.toFixed(2)}</td>
            <td>${produto.quantidadeAtual} ${produto.unidadeMedida}</td>
            <td>
                <button class="btn btn-sm btn-primary me-1" onclick="editarProduto('${produto._id}')">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-sm btn-danger" onclick="excluirProduto('${produto._id}')">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function atualizarSelectProdutos() {
    const select = document.getElementById('produtoVenda');
    select.innerHTML = '<option value="">Selecione...</option>';
    
    produtos.forEach(produto => {
        if (produto.quantidadeAtual > 0) {
            const option = document.createElement('option');
            option.value = produto._id;
            option.textContent = `${produto.nome} (${produto.quantidadeAtual} ${produto.unidadeMedida})`;
            select.appendChild(option);
        }
    });
}

// Funções de formatação e utilidades
function formatarCategoria(categoria) {
    const categorias = {
        'racao': 'Ração',
        'brinquedos': 'Brinquedos',
        'medicamentos': 'Medicamentos',
        'higiene': 'Higiene',
        'acessorios': 'Acessórios',
        'outros': 'Outros'
    };
    return categorias[categoria] || categoria;
}

// Funções de filtro
function filtrarProdutos() {
    const busca = document.getElementById('buscarProduto').value.toLowerCase();
    const categoria = document.getElementById('filtroCategoria').value;

    const produtosFiltrados = produtos.filter(produto => {
        const matchBusca = produto.nome.toLowerCase().includes(busca) ||
                          produto.descricao.toLowerCase().includes(busca);
        const matchCategoria = !categoria || produto.categoria === categoria;

        return matchBusca && matchCategoria;
    });

    atualizarTabelaComFiltro(produtosFiltrados);
}

function atualizarTabelaComFiltro(produtosFiltrados) {
    const tbody = document.getElementById('tabelaProdutos');
    tbody.innerHTML = '';

    if (produtosFiltrados.length === 0) {
        const tr = document.createElement('tr');
        tr.innerHTML = '<td colspan="5" class="text-center">Nenhum produto encontrado</td>';
        tbody.appendChild(tr);
        return;
    }

    produtosFiltrados.forEach(produto => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${produto.nome}</td>
            <td>${formatarCategoria(produto.categoria)}</td>
            <td>R$ ${produto.preco.toFixed(2)}</td>
            <td>${produto.quantidadeAtual} ${produto.unidadeMedida}</td>
            <td>
                <button class="btn btn-sm btn-primary me-1" onclick="editarProduto('${produto._id}')">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-sm btn-danger" onclick="excluirProduto('${produto._id}')">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// Funções de modal
function abrirModalProduto() {
    produtoSelecionado = null;
    document.getElementById('modalProdutoTitle').textContent = 'Novo Produto';
    document.getElementById('formProduto').reset();
    const modal = new bootstrap.Modal(document.getElementById('modalProduto'));
    modal.show();
}

function abrirModalVenda() {
    itensVenda = [];
    document.getElementById('produtoVenda').value = '';
    document.getElementById('quantidadeVenda').value = '1';
    document.getElementById('precoVenda').value = '';
    document.getElementById('totalVenda').textContent = '0.00';
    document.getElementById('itensVenda').innerHTML = '';
    const modal = new bootstrap.Modal(document.getElementById('modalVenda'));
    modal.show();
}

// Funções de CRUD
async function salvarProduto() {
    const form = document.getElementById('formProduto');
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }

    const produto = {
        nome: document.getElementById('nomeProduto').value,
        descricao: document.getElementById('descricaoProduto').value,
        categoria: document.getElementById('categoriaProduto').value,
        preco: parseFloat(document.getElementById('precoProduto').value),
        unidadeMedida: document.getElementById('unidadeMedida').value,
        quantidadeAtual: parseInt(document.getElementById('quantidadeAtual').value)
    };

    try {
        const url = produtoSelecionado 
            ? `/api/produtos/${produtoSelecionado}` 
            : '/api/produtos';
        const method = produtoSelecionado ? 'PUT' : 'POST';

        const response = await fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(produto)
        });

        if (!response.ok) throw new Error('Erro ao salvar produto');

        await carregarProdutos();
        bootstrap.Modal.getInstance(document.getElementById('modalProduto')).hide();
        alert(produtoSelecionado ? 'Produto atualizado com sucesso!' : 'Produto cadastrado com sucesso!');
    } catch (error) {
        console.error('Erro:', error);
        alert('Erro ao salvar produto. Por favor, tente novamente.');
    }
}

async function editarProduto(id) {
    try {
        const response = await fetch(`/api/produtos/${id}`);
        if (!response.ok) throw new Error('Erro ao carregar produto');
        
        const produto = await response.json();
        produtoSelecionado = id;
        
        document.getElementById('modalProdutoTitle').textContent = 'Editar Produto';
        document.getElementById('nomeProduto').value = produto.nome;
        document.getElementById('descricaoProduto').value = produto.descricao;
        document.getElementById('categoriaProduto').value = produto.categoria;
        document.getElementById('precoProduto').value = produto.preco;
        document.getElementById('unidadeMedida').value = produto.unidadeMedida;
        document.getElementById('quantidadeAtual').value = produto.quantidadeAtual;
        
        const modal = new bootstrap.Modal(document.getElementById('modalProduto'));
        modal.show();
    } catch (error) {
        console.error('Erro:', error);
        alert('Erro ao carregar produto para edição. Por favor, tente novamente.');
    }
}

async function excluirProduto(id) {
    if (!confirm('Tem certeza que deseja excluir este produto?')) return;

    try {
        const response = await fetch(`/api/produtos/${id}`, { method: 'DELETE' });
        if (!response.ok) throw new Error('Erro ao excluir produto');
        
        await carregarProdutos();
        alert('Produto excluído com sucesso!');
    } catch (error) {
        console.error('Erro:', error);
        alert('Erro ao excluir produto. Por favor, tente novamente.');
    }
}

// Funções de venda
function atualizarPrecoVenda() {
    const produtoId = document.getElementById('produtoVenda').value;
    const produto = produtos.find(p => p._id === produtoId);
    if (produto) {
        document.getElementById('precoVenda').value = produto.preco.toFixed(2);
        atualizarTotalVenda();
    }
}

function atualizarTotalVenda() {
    const quantidade = parseInt(document.getElementById('quantidadeVenda').value) || 0;
    const preco = parseFloat(document.getElementById('precoVenda').value) || 0;
    document.getElementById('totalVenda').textContent = (quantidade * preco).toFixed(2);
}

function adicionarItemVenda() {
    const produtoId = document.getElementById('produtoVenda').value;
    if (!produtoId) {
        alert('Selecione um produto');
        return;
    }

    const produto = produtos.find(p => p._id === produtoId);
    const quantidade = parseInt(document.getElementById('quantidadeVenda').value);

    if (quantidade <= 0) {
        alert('Quantidade inválida');
        return;
    }

    if (quantidade > produto.quantidadeAtual) {
        alert('Quantidade indisponível em estoque');
        return;
    }

    // Verifica se o produto já está na lista
    const itemExistente = itensVenda.find(item => item.produto._id === produtoId);
    if (itemExistente) {
        if (itemExistente.quantidade + quantidade > produto.quantidadeAtual) {
            alert('Quantidade total excede o estoque disponível');
            return;
        }
        itemExistente.quantidade += quantidade;
        itemExistente.total = itemExistente.quantidade * itemExistente.precoUnitario;
    } else {
        itensVenda.push({
            produto: produto,
            quantidade: quantidade,
            precoUnitario: produto.preco,
            total: quantidade * produto.preco
        });
    }

    atualizarTabelaVenda();
    document.getElementById('produtoVenda').value = '';
    document.getElementById('quantidadeVenda').value = '1';
    document.getElementById('precoVenda').value = '';
    atualizarTotalVenda();
}

function removerItemVenda(index) {
    itensVenda.splice(index, 1);
    atualizarTabelaVenda();
}

function atualizarTabelaVenda() {
    const tbody = document.getElementById('itensVenda');
    tbody.innerHTML = '';
    let total = 0;

    itensVenda.forEach((item, index) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${item.produto.nome}</td>
            <td>${item.quantidade} ${item.produto.unidadeMedida}</td>
            <td>R$ ${item.precoUnitario.toFixed(2)}</td>
            <td>R$ ${item.total.toFixed(2)}</td>
            <td>
                <button class="btn btn-sm btn-danger" onclick="removerItemVenda(${index})">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        tbody.appendChild(tr);
        total += item.total;
    });

    document.getElementById('totalVenda').textContent = total.toFixed(2);
}

async function finalizarVenda() {
    if (itensVenda.length === 0) {
        alert('Adicione pelo menos um item à venda');
        return;
    }

    try {
        // Primeiro registra a venda
        const venda = {
            itens: itensVenda.map(item => ({
                produto: item.produto._id,
                quantidade: item.quantidade,
                precoUnitario: item.precoUnitario,
                total: item.total
            })),
            total: itensVenda.reduce((acc, item) => acc + item.total, 0)
        };

        const responseVenda = await fetch('/api/vendas', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(venda)
        });

        if (!responseVenda.ok) throw new Error('Erro ao registrar venda');

        // Depois atualiza o estoque de cada produto
        for (const item of itensVenda) {
            const response = await fetch(`/api/produtos/${item.produto._id}/venda`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    quantidade: item.quantidade,
                    precoUnitario: item.precoUnitario
                })
            });

            if (!response.ok) throw new Error('Erro ao processar venda');
        }

        await carregarProdutos();
        bootstrap.Modal.getInstance(document.getElementById('modalVenda')).hide();
        alert('Venda realizada com sucesso!');
    } catch (error) {
        console.error('Erro:', error);
        alert('Erro ao finalizar venda. Por favor, tente novamente.');
    }
} 