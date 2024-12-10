const express = require('express');
const router = express.Router();
const db = require('../db');

// lista carrinho
router.get('/', (req, res) => {
    const sql = 'SELECT * FROM carrinho';
    db.query(sql, (err, results) => {
        if (err) {
            console.error('Erro ao buscar carrinho:', err);
            return res.status(500).json({ error: 'Erro ao buscar carrinho' });
        };
        res.json(results);
    });
});



// adicionar produto no carrinho
router.post('/', (req, res) => {
    const { id_cliente, id_produto, quantidade, preco_unitario } = req.body;
    const sql = 'INSERT INTO pedidos (id_cliente, id_produto, quantidade, preco_unitario) VALUES (?, ?, ?, ?)';
    db.query(sql, [id_cliente, id_produto, quantidade, preco_unitario], (err, result) => {
        if (err) {
            console.error('Erro ao criar pedido:', err);
            return res.status(500).json({ error: 'Erro ao criar pedido' });
        }
        res.json({ mensage: 'Produto adicionado com sucesso', id: result.insertId });
    });
});


// atualizar quantidade do produto no carrinho
router.put('/:id', (req, res) => {
    const { id } = req.params;
    const { quantidade } = req.body;

    const sql = 'UPADATE carrinho SET status = ? WHERE id_carrinho = ?' ;
    db.query(sql, [quantidade, id], (err, result) => {
        if (err) {
            console.error("Erro ao atualizar pedido: ", err);
            return res.status(500).json({ error: 'Erro ao atualizar item no carrinho' });
        }
        if (result.affectedrows === 0) {
            return res.status(404).json({ mensage: 'Item não encontrado' });
        }
        res.json({ message: 'Quantidade do item no carrinho atualizado com sucesso!' });
    });
});

//excluir pedido
router.delete('/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM carrinho WHERE id_carrinho = ?';

    db.query(sql, [id], (err, result) => {
        if (err) {
            console.error('Erro ao remover item do  carrinho', err);
            return res.status(500).json({ error: 'Erro ao remover item do carrinho' });
        }
        if (result.affectedrows === 0) {
            return res.status(404).json({ mensage: 'Item  não encontrado no carrinho' });
        }
        res.json({ message: 'Item  removido do carrinho com sucesso!' });
    })
});

module.exports = router;