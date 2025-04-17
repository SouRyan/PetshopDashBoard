const mongoose = require('mongoose');

const produtoSchema = new mongoose.Schema({
    nome: {
        type: String,
        required: [true, 'O nome do produto é obrigatório'],
        trim: true
    },
    descricao: {
        type: String,
        required: [true, 'A descrição do produto é obrigatória'],
        trim: true
    },
    categoria: {
        type: String,
        required: [true, 'A categoria do produto é obrigatória'],
        enum: {
            values: ['racao', 'brinquedos', 'medicamentos', 'higiene', 'acessorios', 'outros'],
            message: 'Categoria inválida'
        }
    },
    preco: {
        type: Number,
        required: [true, 'O preço do produto é obrigatório'],
        min: [0, 'O preço não pode ser negativo']
    },
    unidadeMedida: {
        type: String,
        required: [true, 'A unidade de medida é obrigatória'],
        enum: {
            values: ['unidade', 'kg', 'g', 'ml', 'l'],
            message: 'Unidade de medida inválida'
        }
    },
    quantidadeAtual: {
        type: Number,
        required: [true, 'A quantidade atual é obrigatória'],
        min: [0, 'A quantidade atual não pode ser negativa'],
        default: 0
    }
}, {
    timestamps: true
});

// Índices
produtoSchema.index({ nome: 1 });
produtoSchema.index({ categoria: 1 });

module.exports = mongoose.model('Produto', produtoSchema); 