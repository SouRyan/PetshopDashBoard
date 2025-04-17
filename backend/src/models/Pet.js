const mongoose = require('mongoose');

const petSchema = new mongoose.Schema({
    nome: {
        type: String,
        required: true
    },
    especie: {
        type: String,
        required: true
    },
    raca: {
        type: String,
        required: true
    },
    idade: {
        type: Number,
        required: true
    },
    peso: Number,
    proprietario: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Cliente',
        required: true
    },
    historicoServicos: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Servico'
    }],
    observacoes: String,
    dataCadastro: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Pet', petSchema); 