const express = require('express');
const router = express.Router();
const Produto = require('../models/Produto');

// Listar todos os produtos
router.get('/', async (req, res) => {
    try {
        const produtos = await Produto.find().sort({ nome: 1 });
        res.json(produtos);
    } catch (error) {
        console.error('Erro ao listar produtos:', error);
        res.status(500).json({ message: 'Erro ao listar produtos' });
    }
});

// Listar produtos por categoria
router.get('/categoria/:categoria', async (req, res) => {
    try {
        const produtos = await Produto.find({ 
            categoria: req.params.categoria 
        }).sort({ nome: 1 });
        res.json(produtos);
    } catch (error) {
        console.error('Erro ao listar produtos por categoria:', error);
        res.status(500).json({ message: 'Erro ao listar produtos por categoria' });
    }
});

// Obter um produto específico
router.get('/:id', async (req, res) => {
    try {
        const produto = await Produto.findById(req.params.id);
        if (!produto) {
            return res.status(404).json({ message: 'Produto não encontrado' });
        }
        res.json(produto);
    } catch (error) {
        console.error('Erro ao buscar produto:', error);
        res.status(500).json({ message: 'Erro ao buscar produto' });
    }
});

// Criar novo produto
router.post('/', async (req, res) => {
    try {
        const produto = new Produto(req.body);
        await produto.save();
        res.status(201).json(produto);
    } catch (error) {
        console.error('Erro ao criar produto:', error);
        res.status(500).json({ message: 'Erro ao criar produto' });
    }
});

// Atualizar produto
router.put('/:id', async (req, res) => {
    try {
        const produto = await Produto.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!produto) {
            return res.status(404).json({ message: 'Produto não encontrado' });
        }
        res.json(produto);
    } catch (error) {
        console.error('Erro ao atualizar produto:', error);
        res.status(500).json({ message: 'Erro ao atualizar produto' });
    }
});

// Excluir produto
router.delete('/:id', async (req, res) => {
    try {
        const produto = await Produto.findByIdAndDelete(req.params.id);
        if (!produto) {
            return res.status(404).json({ message: 'Produto não encontrado' });
        }
        res.json({ message: 'Produto excluído com sucesso' });
    } catch (error) {
        console.error('Erro ao excluir produto:', error);
        res.status(500).json({ message: 'Erro ao excluir produto' });
    }
});

// Registrar venda
router.post('/:id/venda', async (req, res) => {
    try {
        const produto = await Produto.findById(req.params.id);
        if (!produto) {
            return res.status(404).json({ message: 'Produto não encontrado' });
        }

        const { quantidade } = req.body;

        if (quantidade > produto.quantidadeAtual) {
            return res.status(400).json({ 
                message: 'Quantidade insuficiente em estoque' 
            });
        }

        produto.quantidadeAtual -= quantidade;
        await produto.save();

        res.json(produto);
    } catch (error) {
        console.error('Erro ao registrar venda:', error);
        res.status(500).json({ message: 'Erro ao registrar venda' });
    }
});

module.exports = router; 