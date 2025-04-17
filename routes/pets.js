const express = require('express');
const router = express.Router();
const Pet = require('../models/Pet');

// Listar todos os pets
router.get('/', async (req, res) => {
    try {
        const pets = await Pet.find().populate('proprietario', 'nome');
        res.json(pets);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Buscar pets por cliente
router.get('/cliente/:clienteId', async (req, res) => {
    try {
        const pets = await Pet.find({ proprietario: req.params.clienteId }).populate('proprietario', 'nome');
        res.json(pets);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Buscar um pet específico
router.get('/:id', async (req, res) => {
    try {
        const pet = await Pet.findById(req.params.id).populate('proprietario', 'nome');
        if (!pet) {
            return res.status(404).json({ message: 'Pet não encontrado' });
        }
        res.json(pet);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Criar novo pet
router.post('/', async (req, res) => {
    try {
        const pet = new Pet(req.body);
        const novoPet = await pet.save();
        res.status(201).json(novoPet);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Atualizar pet
router.put('/:id', async (req, res) => {
    try {
        const pet = await Pet.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        ).populate('proprietario', 'nome');
        
        if (!pet) {
            return res.status(404).json({ message: 'Pet não encontrado' });
        }
        res.json(pet);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Excluir pet
router.delete('/:id', async (req, res) => {
    try {
        const pet = await Pet.findByIdAndDelete(req.params.id);
        if (!pet) {
            return res.status(404).json({ message: 'Pet não encontrado' });
        }
        res.json({ message: 'Pet excluído com sucesso' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Buscar histórico de serviços de um pet
router.get('/:id/servicos', async (req, res) => {
    try {
        const pet = await Pet.findById(req.params.id);
        if (!pet) {
            return res.status(404).json({ message: 'Pet não encontrado' });
        }
        res.json(pet.historicoServicos || []);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router; 