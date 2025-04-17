const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database');
require('dotenv').config();

const app = express();

// Conectar ao banco de dados
connectDB();

// Middlewares
app.use(cors());
app.use(express.json());

// Rotas (a serem implementadas)
app.use('/api/clientes', require('./routes/clientes'));
app.use('/api/pets', require('./routes/pets'));
app.use('/api/produtos', require('./routes/produtos'));
app.use('/api/servicos', require('./routes/servicos'));
app.use('/api/vendas', require('./routes/vendas'));
app.use('/api/fornecedores', require('./routes/fornecedores'));
app.use('/api/categorias', require('./routes/categorias'));
app.use('/api/financeiro', require('./routes/financeiro'));

// Rota padrão
app.get('/', (req, res) => {
    res.json({ message: 'API do Sistema de Petshop' });
});

// Tratamento de erros
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Erro interno do servidor!' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
}); 