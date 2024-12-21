const express = require('express');
const router = express.Router();
const db = require('../db/db');
const verificaClienteLojaMiddleware = require('../middlewares/verificaClienteLojaMiddleware');

// 1. Rota para listar todos os itens de um pedido
router.get('/:id_pedido/itens', verificaClienteLojaMiddleware, (req, res) => {
    const { id_pedido } = req.params;

    const sql = 'SELECT * FROM itens_pedido WHERE id_pedido = ?';
    db.query(sql, [id_pedido], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Erro ao buscar itens do pedido' });
        }
        res.json(results);
    });
});

// 2. Rota para adicionar um item ao pedido
router.post('/:id_pedido/itens', verificaClienteLojaMiddleware, (req, res) => {
    const { id_pedido } = req.params;
    const { id_produto, quantidade, preco_total } = req.body;

    const sql = 'INSERT INTO itens_pedido (id_pedido, id_produto, quantidade, preco_total) VALUES (?, ?, ?, ?)';
    db.query(sql, [id_pedido, id_produto, quantidade, preco_total], (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Erro ao adicionar item no pedido' });
        }
        res.json({ message: 'Item adicionado com sucesso', id_item: result.insertId });
    });
});

// 3. Rota para atualizar a quantidade de um item no pedido
router.put('/:id_pedido/itens/:id_item', verificaClienteLojaMiddleware, (req, res) => {
    const { id_pedido, id_item } = req.params;
    const { quantidade, preco_total } = req.body;

    const sql = 'UPDATE itens_pedido SET quantidade = ?, preco_total = ? WHERE id_pedido = ? AND id_item = ?';
    db.query(sql, [quantidade, preco_total, id_pedido, id_item], (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Erro ao atualizar item do pedido' });
        }
        res.json({ message: 'Item atualizado com sucesso' });
    });
});

// 4. Rota para excluir um item do pedido
router.delete('/:id_pedido/itens/:id_item', verificaClienteLojaMiddleware, (req, res) => {
    const { id_pedido, id_item } = req.params;

    const sql = 'DELETE FROM itens_pedido WHERE id_pedido = ? AND id_item = ?';
    db.query(sql, [id_pedido, id_item], (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Erro ao excluir item do pedido' });
        }
        res.json({ message: 'Item excluído com sucesso' });
    });
});


module.exports = router;
