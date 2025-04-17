const mongoose = require('mongoose');

const servicoSchema = new mongoose.Schema({
    clienteId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Cliente',
        required: true
    },
    petId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Pet',
        required: true
    },
    tipo: {
        type: String,
        required: true,
        enum: ['banho', 'tosa', 'consulta', 'vacina', 'outros']
    },
    dataHora: {
        type: Date,
        required: true
    },
    preco: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['agendado', 'em_andamento', 'concluido', 'cancelado', 'finalizado'],
        default: 'agendado'
    },
    observacoes: String
});

module.exports = mongoose.model('Servico', servicoSchema); 