const mongoose = require('mongoose');

const fornecedorSchema = new mongoose.Schema({
    razaoSocial: {
        type: String,
        required: true
    },
    nomeFantasia: String,
    cnpj: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true
    },
    telefone: {
        type: String,
        required: true
    },
    endereco: {
        rua: String,
        numero: String,
        complemento: String,
        bairro: String,
        cidade: String,
        estado: String,
        cep: String
    },
    categoriasProdutos: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Categoria'
    }],
    contato: {
        nome: String,
        telefone: String,
        email: String
    },
    status: {
        type: String,
        enum: ['ativo', 'inativo'],
        default: 'ativo'
    },
    dataCadastro: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Fornecedor', fornecedorSchema); 