// Configuração da API
const API_URL = 'http://localhost:5000/api';

// Variáveis globais
let pets = [];
let petsOriginal = []; // Lista original para filtros
let petAtual = null;
let clientes = [];

// Carregar dados ao iniciar a página
document.addEventListener('DOMContentLoaded', async () => {
    await Promise.all([
        carregarPets(),
        carregarClientes()
    ]);
});

// Funções de utilidade
const formatarData = (data) => {
    return new Date(data).toLocaleDateString('pt-BR');
};

// Carregar lista de pets
async function carregarPets() {
    try {
        const response = await fetch(`${API_URL}/pets`);
        pets = await response.json();
        petsOriginal = [...pets]; // Mantém uma cópia da lista original
        atualizarTabelaPets();
    } catch (error) {
        console.error('Erro ao carregar pets:', error);
        alert('Erro ao carregar lista de pets');
    }
}

// Carregar lista de clientes
async function carregarClientes() {
    try {
        const response = await fetch(`${API_URL}/clientes`);
        clientes = await response.json();
        preencherSelectClientes();
    } catch (error) {
        console.error('Erro ao carregar clientes:', error);
        alert('Erro ao carregar lista de clientes');
    }
}

// Preencher selects de clientes
function preencherSelectClientes() {
    const selects = ['proprietario', 'proprietarioPet'];
    
    selects.forEach(selectId => {
        const select = document.getElementById(selectId);
        select.innerHTML = '<option value="">Selecione...</option>';
        
        clientes.forEach(cliente => {
            const option = document.createElement('option');
            option.value = cliente._id;
            option.textContent = cliente.nome;
            select.appendChild(option);
        });
    });
}

// Atualizar tabela de pets
function atualizarTabelaPets() {
    const tabela = document.getElementById('tabelaPets');
    tabela.innerHTML = '';

    pets.forEach(pet => {
        const proprietario = pet.proprietario ? pet.proprietario.nome : 'N/A';
        const ultimoServico = pet.historicoServicos && pet.historicoServicos.length > 0 
            ? formatarData(pet.historicoServicos[pet.historicoServicos.length - 1].data)
            : 'Nenhum';

        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${pet.nome}</td>
            <td>${pet.especie}</td>
            <td>${pet.raca}</td>
            <td>${pet.idade} anos</td>
            <td>${proprietario}</td>
            <td>${ultimoServico}</td>
            <td>
                <button class="btn btn-sm btn-info me-1" onclick="editarPet('${pet._id}')">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-sm btn-danger" onclick="excluirPet('${pet._id}')">
                    <i class="fas fa-trash"></i>
                </button>
                <button class="btn btn-sm btn-success" onclick="verHistorico('${pet._id}')">
                    <i class="fas fa-history"></i>
                </button>
            </td>
        `;
        tabela.appendChild(tr);
    });
}

// Filtrar pets
function filtrarPets() {
    const busca = document.getElementById('busca').value.toLowerCase();
    const especie = document.getElementById('especie').value;
    const proprietarioId = document.getElementById('proprietario').value;

    pets = petsOriginal.filter(pet => {
        const matchBusca = pet.nome.toLowerCase().includes(busca);
        const matchEspecie = !especie || pet.especie === especie;
        const matchProprietario = !proprietarioId || pet.proprietario._id === proprietarioId;

        return matchBusca && matchEspecie && matchProprietario;
    });

    atualizarTabelaPets();
}

// Salvar pet
async function salvarPet() {
    const pet = {
        nome: document.getElementById('nomePet').value,
        proprietario: document.getElementById('proprietarioPet').value,
        especie: document.getElementById('especiePet').value,
        raca: document.getElementById('racaPet').value,
        idade: parseInt(document.getElementById('idadePet').value),
        peso: parseFloat(document.getElementById('pesoPet').value) || null,
        observacoes: document.getElementById('observacoesPet').value
    };

    try {
        const url = petAtual 
            ? `${API_URL}/pets/${petAtual}` 
            : `${API_URL}/pets`;
        
        const method = petAtual ? 'PUT' : 'POST';

        const response = await fetch(url, {
            method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(pet)
        });

        if (!response.ok) {
            throw new Error('Erro ao salvar pet');
        }

        await carregarPets();
        document.getElementById('formPet').reset();
        bootstrap.Modal.getInstance(document.getElementById('modalPet')).hide();
        
        alert(petAtual ? 'Pet atualizado com sucesso!' : 'Pet cadastrado com sucesso!');
        petAtual = null;

    } catch (error) {
        console.error('Erro ao salvar pet:', error);
        alert('Erro ao salvar pet');
    }
}

// Editar pet
async function editarPet(id) {
    try {
        const response = await fetch(`${API_URL}/pets/${id}`);
        const pet = await response.json();

        petAtual = id;
        
        document.getElementById('nomePet').value = pet.nome;
        document.getElementById('proprietarioPet').value = pet.proprietario;
        document.getElementById('especiePet').value = pet.especie;
        document.getElementById('racaPet').value = pet.raca;
        document.getElementById('idadePet').value = pet.idade;
        document.getElementById('pesoPet').value = pet.peso || '';
        document.getElementById('observacoesPet').value = pet.observacoes || '';

        document.getElementById('modalPetTitle').textContent = 'Editar Pet';
        new bootstrap.Modal(document.getElementById('modalPet')).show();

    } catch (error) {
        console.error('Erro ao carregar pet:', error);
        alert('Erro ao carregar dados do pet');
    }
}

// Excluir pet
async function excluirPet(id) {
    if (!confirm('Tem certeza que deseja excluir este pet?')) {
        return;
    }

    try {
        const response = await fetch(`${API_URL}/pets/${id}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            throw new Error('Erro ao excluir pet');
        }

        await carregarPets();
        alert('Pet excluído com sucesso!');

    } catch (error) {
        console.error('Erro ao excluir pet:', error);
        alert('Erro ao excluir pet');
    }
}

// Ver histórico de serviços
async function verHistorico(id) {
    try {
        const response = await fetch(`${API_URL}/pets/${id}/servicos`);
        const servicos = await response.json();
        
        // Aqui você pode implementar a lógica para mostrar o histórico
        // Por exemplo, abrir um modal com uma tabela de serviços
        console.log('Histórico de serviços:', servicos);
        
    } catch (error) {
        console.error('Erro ao carregar histórico:', error);
        alert('Erro ao carregar histórico de serviços');
    }
}

// Limpar formulário ao abrir modal de novo pet
document.getElementById('modalPet').addEventListener('show.bs.modal', function (event) {
    if (!petAtual) {
        document.getElementById('formPet').reset();
        document.getElementById('modalPetTitle').textContent = 'Novo Pet';
    }
}); 