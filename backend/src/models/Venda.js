const mongoose = require('mongoose');

const itemVendaSchema = new mongoose.Schema({
    produto: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Produto',
        required: true
    },
    quantidade: {
        type: Number,
        required: true
    },
    precoUnitario: {
        type: Number,
        required: true
    },
    subtotal: {
        type: Number,
        required: true
    }
});

const vendaSchema = new mongoose.Schema({
    cliente: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Cliente',
        required: true
    },
    itens: [itemVendaSchema],
    servicos: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Servico'
    }],
    total: {
        type: Number,
        required: true
    },
    formaPagamento: {
        type: String,
        required: true,
        enum: ['dinheiro', 'cartao_credito', 'cartao_debito', 'pix']
    },
    status: {
        type: String,
        enum: ['pendente', 'pago', 'cancelado'],
        default: 'pendente'
    },
    dataPagamento: Date,
    observacoes: String,
    dataCriacao: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Venda', vendaSchema); 