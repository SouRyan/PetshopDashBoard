const mongoose = require('mongoose');

const produtoSchema = new mongoose.Schema({
    nome: {
        type: String,
        required: true
    },
    descricao: String,
    preco: {
        type: Number,
        required: true
    },
    categoria: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Categoria',
        required: true
    },
    fornecedor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Fornecedor'
    },
    estoque: {
        quantidade: {
            type: Number,
            default: 0
        },
        minimo: {
            type: Number,
            default: 5
        }
    },
    codigoBarras: {
        type: String,
        unique: true
    },
    dataCadastro: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        enum: ['ativo', 'inativo'],
        default: 'ativo'
    }
});

module.exports = mongoose.model('Produto', produtoSchema); 