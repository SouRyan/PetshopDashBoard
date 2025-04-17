const mongoose = require('mongoose');

const movimentacaoEstoqueSchema = new mongoose.Schema({
    produto: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Produto',
        required: [true, 'O produto é obrigatório']
    },
    tipo: {
        type: String,
        required: [true, 'O tipo de movimentação é obrigatório'],
        enum: {
            values: ['entrada', 'saida'],
            message: 'Tipo de movimentação inválido'
        }
    },
    motivo: {
        type: String,
        required: [true, 'O motivo da movimentação é obrigatório'],
        enum: {
            values: ['compra', 'venda'],
            message: 'Motivo inválido'
        }
    },
    quantidade: {
        type: Number,
        required: [true, 'A quantidade é obrigatória'],
        min: [1, 'A quantidade deve ser maior que zero']
    },
    precoUnitario: {
        type: Number,
        required: [true, 'O preço unitário é obrigatório'],
        min: [0, 'O preço unitário não pode ser negativo']
    },
    observacoes: {
        type: String,
        trim: true
    },
    data: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Índices
movimentacaoEstoqueSchema.index({ produto: 1, data: -1 });
movimentacaoEstoqueSchema.index({ tipo: 1 });
movimentacaoEstoqueSchema.index({ motivo: 1 });

// Middleware para atualizar o estoque do produto
movimentacaoEstoqueSchema.pre('save', async function(next) {
    try {
        const Produto = mongoose.model('Produto');
        const produto = await Produto.findById(this.produto);

        if (!produto) {
            throw new Error('Produto não encontrado');
        }

        // Atualiza a quantidade do produto
        if (this.tipo === 'entrada') {
            produto.quantidadeAtual += this.quantidade;
        } else {
            if (produto.quantidadeAtual < this.quantidade) {
                throw new Error('Quantidade insuficiente em estoque');
            }
            produto.quantidadeAtual -= this.quantidade;
        }

        await produto.save();
        next();
    } catch (error) {
        next(error);
    }
});

module.exports = mongoose.model('MovimentacaoEstoque', movimentacaoEstoqueSchema); 