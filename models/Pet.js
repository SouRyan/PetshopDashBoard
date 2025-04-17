const mongoose = require('mongoose');

const petSchema = new mongoose.Schema({
    nome: {
        type: String,
        required: true
    },
    proprietario: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Cliente',
        required: true
    },
    especie: {
        type: String,
        required: true,
        enum: ['cachorro', 'gato', 'passaro', 'outros']
    },
    raca: {
        type: String,
        required: true
    },
    idade: {
        type: Number,
        required: true
    },
    peso: {
        type: Number
    },
    observacoes: {
        type: String
    },
    historicoServicos: [{
        data: Date,
        servico: String,
        observacoes: String
    }]
}, {
    timestamps: true
});

module.exports = mongoose.model('Pet', petSchema); 