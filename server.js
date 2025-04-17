require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const morgan = require('morgan');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Servir arquivos estáticos do frontend
app.use(express.static(path.join(__dirname, 'frontend')));

// Configuração do mongoose
const mongoOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000, // Timeout após 5 segundos
    socketTimeoutMS: 45000, // Timeout do socket após 45 segundos
    family: 4 // Força IPv4
};

// Conexão com o MongoDB
console.log('Tentando conectar ao MongoDB...');
mongoose.connect(process.env.MONGODB_URI, mongoOptions)
    .then(() => {
        console.log('Conectado ao MongoDB Atlas com sucesso!');
    })
    .catch(err => {
        console.error('Erro ao conectar ao MongoDB Atlas:', err);
        process.exit(1); // Encerra o processo se não conseguir conectar
    });

// Middleware para logging de requisições
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
});

// Rotas
const servicosRouter = require('./routes/servicos');
const produtosRouter = require('./routes/produtos');
app.use('/api/clientes', require('./routes/clientes'));
app.use('/api/pets', require('./routes/pets'));
app.use('/api/servicos', servicosRouter);
app.use('/api/produtos', produtosRouter);
app.use('/api/vendas', require('./routes/vendas'));
app.use('/api/funcionarios', require('./routes/funcionarios'));

// Tratamento de erros global
app.use((err, req, res, next) => {
    console.error('Erro:', err.stack);
    res.status(500).json({ 
        message: 'Erro interno do servidor',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// Rota para todas as outras requisições (SPA fallback)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'index.html'));
});

// Iniciar servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
    console.log(`Ambiente: ${process.env.NODE_ENV}`);
}); 