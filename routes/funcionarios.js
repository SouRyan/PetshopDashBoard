const express = require('express');
const router = express.Router();

// Rota GET para listar todos os funcionários
router.get('/', async (req, res) => {
    try {
        res.json([]);  // Por enquanto retorna uma lista vazia
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router; 