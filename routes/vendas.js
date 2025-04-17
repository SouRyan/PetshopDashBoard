const express = require('express');
const router = express.Router();
const Venda = require('../models/Venda');

// Registrar nova venda
router.post('/', async (req, res) => {
    try {
        console.log('Recebendo nova venda:', req.body);
        const venda = new Venda(req.body);
        await venda.save();
        console.log('Venda registrada com sucesso:', venda._id);
        res.status(201).json(venda);
    } catch (error) {
        console.error('Erro ao registrar venda:', error);
        res.status(500).json({ message: 'Erro ao registrar venda' });
    }
});

// Buscar vendas do dia
router.get('/hoje', async (req, res) => {
    try {
        console.log('Buscando vendas do dia...');
        const hoje = new Date();
        hoje.setHours(0, 0, 0, 0);
        
        const amanha = new Date(hoje);
        amanha.setDate(amanha.getDate() + 1);

        console.log('Período de busca:', { hoje, amanha });

        const vendas = await Venda.find({
            data: {
                $gte: hoje,
                $lt: amanha
            }
        })
        .populate('itens.produto', 'nome preco unidadeMedida')
        .sort({ data: -1 });

        console.log(`Encontradas ${vendas.length} vendas`);

        // Calcular total do dia
        const totalDia = vendas.reduce((acc, venda) => acc + (venda.total || 0), 0);

        const resposta = {
            vendas,
            totalDia,
            quantidadeVendas: vendas.length
        };

        console.log('Resposta preparada:', {
            totalDia,
            quantidadeVendas: vendas.length
        });

        res.json(resposta);
    } catch (error) {
        console.error('Erro ao buscar vendas do dia:', error);
        res.status(500).json({ 
            message: 'Erro ao buscar vendas do dia',
            error: error.message 
        });
    }
});

// Listar todas as vendas
router.get('/', async (req, res) => {
    try {
        const vendas = await Venda.find()
            .populate('itens.produto', 'nome preco unidadeMedida')
            .sort({ data: -1 });
        res.json(vendas);
    } catch (error) {
        console.error('Erro ao listar vendas:', error);
        res.status(500).json({ message: 'Erro ao listar vendas' });
    }
});

module.exports = router; 