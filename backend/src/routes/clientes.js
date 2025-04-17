const express = require('express');
const router = express.Router();
const Cliente = require('../models/Cliente');

// Listar todos os clientes
router.get('/', async (req, res) => {
    try {
        const clientes = await Cliente.find().populate('pets');
        res.json(clientes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Obter um cliente específico
router.get('/:id', async (req, res) => {
    try {
        const cliente = await Cliente.findById(req.params.id).populate('pets');
        if (!cliente) {
            return res.status(404).json({ message: 'Cliente não encontrado' });
        }
        res.json(cliente);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Criar um novo cliente
router.post('/', async (req, res) => {
    const cliente = new Cliente(req.body);
    try {
        const novoCliente = await cliente.save();
        res.status(201).json(novoCliente);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Atualizar um cliente
router.put('/:id', async (req, res) => {
    try {
        const cliente = await Cliente.findById(req.params.id);
        if (!cliente) {
            return res.status(404).json({ message: 'Cliente não encontrado' });
        }
        
        Object.assign(cliente, req.body);
        const clienteAtualizado = await cliente.save();
        res.json(clienteAtualizado);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Deletar um cliente
router.delete('/:id', async (req, res) => {
    try {
        const cliente = await Cliente.findById(req.params.id);
        if (!cliente) {
            return res.status(404).json({ message: 'Cliente não encontrado' });
        }
        
        await cliente.remove();
        res.json({ message: 'Cliente removido com sucesso' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router; 