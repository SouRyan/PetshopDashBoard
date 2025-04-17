const mongoose = require('mongoose');

const servicoSchema = new mongoose.Schema({
    tipo: {
        type: String,
        required: true,
        enum: ['banho', 'tosa', 'consulta', 'vacina', 'outros']
    },
    descricao: String,
    preco: {
        type: Number,
        required: true
    },
    duracao: {
        type: Number, // em minutos
        required: true
    },
    pet: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Pet',
        required: true
    },
    cliente: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Cliente',
        required: true
    },
    funcionario: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Funcionario',
        required: true
    },
    dataAgendamento: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        enum: ['agendado', 'em_andamento', 'concluido', 'cancelado'],
        default: 'agendado'
    },
    observacoes: String,
    dataCriacao: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Servico', servicoSchema); 