const mongoose = require('mongoose');

const vendaItemSchema = new mongoose.Schema({
    produto: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Produto',
        required: true
    },
    quantidade: {
        type: Number,
        required: true,
        min: 1
    },
    precoUnitario: {
        type: Number,
        required: true,
        min: 0
    },
    total: {
        type: Number,
        required: true,
        min: 0
    }
});

const vendaSchema = new mongoose.Schema({
    itens: [vendaItemSchema],
    total: {
        type: Number,
        required: true,
        min: 0
    },
    data: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Índices
vendaSchema.index({ data: -1 });

module.exports = mongoose.model('Venda', vendaSchema); 