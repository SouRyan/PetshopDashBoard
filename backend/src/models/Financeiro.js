const mongoose = require('mongoose');

const movimentacaoSchema = new mongoose.Schema({
    tipo: {
        type: String,
        enum: ['receita', 'despesa'],
        required: true
    },
    categoria: {
        type: String,
        required: true
    },
    descricao: {
        type: String,
        required: true
    },
    valor: {
        type: Number,
        required: true
    },
    data: {
        type: Date,
        required: true
    },
    formaPagamento: {
        type: String,
        enum: ['dinheiro', 'cartao_credito', 'cartao_debito', 'pix', 'transferencia'],
        required: true
    },
    status: {
        type: String,
        enum: ['pendente', 'pago', 'cancelado'],
        default: 'pendente'
    },
    referencia: {
        tipo: {
            type: String,
            enum: ['venda', 'servico', 'fornecedor', 'funcionario', 'outros']
        },
        id: {
            type: mongoose.Schema.Types.ObjectId,
            refPath: 'referencia.tipo'
        }
    },
    comprovante: String,
    observacoes: String,
    dataCriacao: {
        type: Date,
        default: Date.now
    }
});

const fluxoCaixaSchema = new mongoose.Schema({
    data: {
        type: Date,
        required: true
    },
    saldoInicial: {
        type: Number,
        required: true
    },
    saldoFinal: {
        type: Number,
        required: true
    },
    totalReceitas: {
        type: Number,
        default: 0
    },
    totalDespesas: {
        type: Number,
        default: 0
    },
    movimentacoes: [movimentacaoSchema]
});

module.exports = {
    Movimentacao: mongoose.model('Movimentacao', movimentacaoSchema),
    FluxoCaixa: mongoose.model('FluxoCaixa', fluxoCaixaSchema)
}; 