const express = require('express');
const router = express.Router();
const Servico = require('../models/Servico');

// Listar todos os serviços
router.get('/', async (req, res) => {
    try {
        const servicos = await Servico.find()
            .populate({
                path: 'clienteId',
                select: 'nome email telefone'
            })
            .populate({
                path: 'petId',
                select: 'nome especie raca'
            })
            .sort({ dataHora: -1 }); // Ordena do mais recente para o mais antigo
        
        // Formata os dados antes de enviar
        const servicosFormatados = servicos.map(servico => ({
            _id: servico._id,
            dataHora: servico.dataHora,
            tipo: servico.tipo,
            status: servico.status,
            preco: servico.preco,
            observacoes: servico.observacoes,
            cliente: servico.clienteId ? {
                _id: servico.clienteId._id,
                nome: servico.clienteId.nome,
                email: servico.clienteId.email,
                telefone: servico.clienteId.telefone
            } : null,
            pet: servico.petId ? {
                _id: servico.petId._id,
                nome: servico.petId.nome,
                especie: servico.petId.especie,
                raca: servico.petId.raca
            } : null
        }));

        res.json(servicosFormatados);
    } catch (error) {
        console.error('Erro ao listar serviços:', error);
        res.status(500).json({ message: error.message });
    }
});

// Obter um serviço específico
router.get('/:id', async (req, res) => {
    try {
        const servico = await Servico.findById(req.params.id)
            .populate({
                path: 'clienteId',
                select: 'nome email telefone'
            })
            .populate({
                path: 'petId',
                select: 'nome especie raca'
            });

        if (!servico) {
            return res.status(404).json({ message: 'Serviço não encontrado' });
        }

        // Formata os dados antes de enviar
        const servicoFormatado = {
            _id: servico._id,
            dataHora: servico.dataHora,
            tipo: servico.tipo,
            status: servico.status,
            preco: servico.preco,
            observacoes: servico.observacoes,
            cliente: servico.clienteId ? {
                _id: servico.clienteId._id,
                nome: servico.clienteId.nome,
                email: servico.clienteId.email,
                telefone: servico.clienteId.telefone
            } : null,
            pet: servico.petId ? {
                _id: servico.petId._id,
                nome: servico.petId.nome,
                especie: servico.petId.especie,
                raca: servico.petId.raca
            } : null
        };

        res.json(servicoFormatado);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Criar um novo serviço
router.post('/', async (req, res) => {
    try {
        const servicoData = {
            ...req.body,
            clienteId: req.body.cliente,
            petId: req.body.pet
        };
        delete servicoData.cliente;
        delete servicoData.pet;

        const servico = new Servico(servicoData);
        const novoServico = await servico.save();
        
        // Retorna o serviço formatado
        const servicoPopulado = await Servico.findById(novoServico._id)
            .populate({
                path: 'clienteId',
                select: 'nome email telefone'
            })
            .populate({
                path: 'petId',
                select: 'nome especie raca'
            });

        const servicoFormatado = {
            _id: servicoPopulado._id,
            dataHora: servicoPopulado.dataHora,
            tipo: servicoPopulado.tipo,
            status: servicoPopulado.status,
            preco: servicoPopulado.preco,
            observacoes: servicoPopulado.observacoes,
            cliente: servicoPopulado.clienteId ? {
                _id: servicoPopulado.clienteId._id,
                nome: servicoPopulado.clienteId.nome,
                email: servicoPopulado.clienteId.email,
                telefone: servicoPopulado.clienteId.telefone
            } : null,
            pet: servicoPopulado.petId ? {
                _id: servicoPopulado.petId._id,
                nome: servicoPopulado.petId.nome,
                especie: servicoPopulado.petId.especie,
                raca: servicoPopulado.petId.raca
            } : null
        };

        res.status(201).json(servicoFormatado);
    } catch (error) {
        console.error('Erro ao criar serviço:', error);
        res.status(400).json({ message: error.message });
    }
});

// Atualizar um serviço
router.put('/:id', async (req, res) => {
    try {
        const servicoData = {
            ...req.body,
            clienteId: req.body.cliente,
            petId: req.body.pet
        };
        delete servicoData.cliente;
        delete servicoData.pet;

        const servico = await Servico.findByIdAndUpdate(
            req.params.id,
            servicoData,
            { new: true }
        ).populate({
            path: 'clienteId',
            select: 'nome email telefone'
        }).populate({
            path: 'petId',
            select: 'nome especie raca'
        });

        if (!servico) {
            return res.status(404).json({ message: 'Serviço não encontrado' });
        }

        const servicoFormatado = {
            _id: servico._id,
            dataHora: servico.dataHora,
            tipo: servico.tipo,
            status: servico.status,
            preco: servico.preco,
            observacoes: servico.observacoes,
            cliente: servico.clienteId ? {
                _id: servico.clienteId._id,
                nome: servico.clienteId.nome,
                email: servico.clienteId.email,
                telefone: servico.clienteId.telefone
            } : null,
            pet: servico.petId ? {
                _id: servico.petId._id,
                nome: servico.petId.nome,
                especie: servico.petId.especie,
                raca: servico.petId.raca
            } : null
        };

        res.json(servicoFormatado);
    } catch (error) {
        console.error('Erro ao atualizar serviço:', error);
        res.status(400).json({ message: error.message });
    }
});

// Excluir um serviço
router.delete('/:id', async (req, res) => {
    try {
        const servico = await Servico.findByIdAndDelete(req.params.id);
        if (!servico) {
            return res.status(404).json({ message: 'Serviço não encontrado' });
        }
        res.json({ message: 'Serviço excluído com sucesso' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Atualizar status do serviço
router.patch('/:id/status', async (req, res) => {
    try {
        const servico = await Servico.findByIdAndUpdate(
            req.params.id,
            { status: req.body.status },
            { new: true }
        );
        if (!servico) {
            return res.status(404).json({ message: 'Serviço não encontrado' });
        }
        res.json(servico);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Buscar histórico de serviços por cliente e pet
router.get('/historico/:clienteId/:petId', async (req, res) => {
    try {
        const { clienteId, petId } = req.params;
        
        const servicos = await Servico.find({
            clienteId: clienteId,
            petId: petId
        })
        .populate({
            path: 'clienteId',
            select: 'nome email telefone'
        })
        .populate({
            path: 'petId',
            select: 'nome especie raca'
        })
        .sort({ dataHora: -1 });

        const historicoFormatado = servicos.map(servico => ({
            _id: servico._id,
            dataHora: servico.dataHora,
            tipo: servico.tipo,
            status: servico.status,
            preco: servico.preco,
            observacoes: servico.observacoes,
            cliente: servico.clienteId ? {
                _id: servico.clienteId._id,
                nome: servico.clienteId.nome,
                email: servico.clienteId.email,
                telefone: servico.clienteId.telefone
            } : null,
            pet: servico.petId ? {
                _id: servico.petId._id,
                nome: servico.petId.nome,
                especie: servico.petId.especie,
                raca: servico.petId.raca
            } : null
        }));

        res.json(historicoFormatado);
    } catch (error) {
        console.error('Erro ao buscar histórico:', error);
        res.status(500).json({ message: error.message });
    }
});

// Mover serviço para histórico
router.post('/:id/finalizar', async (req, res) => {
    try {
        const servico = await Servico.findById(req.params.id)
            .populate({
                path: 'clienteId',
                select: 'nome email telefone'
            })
            .populate({
                path: 'petId',
                select: 'nome especie raca'
            });

        if (!servico) {
            return res.status(404).json({ message: 'Serviço não encontrado' });
        }

        // Atualiza o status para finalizado
        servico.status = 'finalizado';
        await servico.save();

        // Retorna o serviço formatado
        const servicoFormatado = {
            _id: servico._id,
            dataHora: servico.dataHora,
            tipo: servico.tipo,
            status: servico.status,
            preco: servico.preco,
            observacoes: servico.observacoes,
            cliente: servico.clienteId ? {
                _id: servico.clienteId._id,
                nome: servico.clienteId.nome,
                email: servico.clienteId.email,
                telefone: servico.clienteId.telefone
            } : null,
            pet: servico.petId ? {
                _id: servico.petId._id,
                nome: servico.petId.nome,
                especie: servico.petId.especie,
                raca: servico.petId.raca
            } : null
        };

        res.json(servicoFormatado);
    } catch (error) {
        console.error('Erro ao finalizar serviço:', error);
        res.status(500).json({ message: error.message });
    }
});

// Buscar histórico de serviços finalizados
router.get('/historico/finalizados', async (req, res) => {
    try {
        const servicos = await Servico.find({ status: 'finalizado' })
            .populate({
                path: 'clienteId',
                select: 'nome email telefone'
            })
            .populate({
                path: 'petId',
                select: 'nome especie raca'
            })
            .sort({ dataHora: -1 });

        const servicosFormatados = servicos.map(servico => ({
            _id: servico._id,
            dataHora: servico.dataHora,
            tipo: servico.tipo,
            status: servico.status,
            preco: servico.preco,
            observacoes: servico.observacoes,
            cliente: servico.clienteId ? {
                _id: servico.clienteId._id,
                nome: servico.clienteId.nome,
                email: servico.clienteId.email,
                telefone: servico.clienteId.telefone
            } : null,
            pet: servico.petId ? {
                _id: servico.petId._id,
                nome: servico.petId.nome,
                especie: servico.petId.especie,
                raca: servico.petId.raca
            } : null
        }));

        res.json(servicosFormatados);
    } catch (error) {
        console.error('Erro ao buscar histórico:', error);
        res.status(500).json({ message: error.message });
    }
});

module.exports = router; 