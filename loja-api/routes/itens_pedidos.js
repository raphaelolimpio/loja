const express = require('express');
const router = express.Router();
const db = require('../db');

// Rota para listar todos os itens de um pedido
router.get('/:id/pedidos', (req, res) => {
    const { id } = req.params;
    const sql = 'SELECT * FROM itens_pedido WHERE id_pedido = ?';

    db.query(sql, [id], (err, results) => {
        if (err) {
            console.error('Erro ao buscar itens do pedido:', err);
            return res.status(500).json({ error: 'Erro ao buscar itens do pedido' });
        }
        res.json(results);
    });
});

// Rota para adicionar um item ao pedido
router.post('/:id/pedido', (req, res) => {
    const { id } = req.params;
    const { id_produto, quantidade, preco_total } = req.body;
    const sql = 'INSERT INTO itens_pedido (id_pedido, id_produto, quantidade, preco_total) VALUES (?, ?, ?, ?)';

    db.query(sql, [id, id_produto, quantidade, preco_total], (err, result) => {
        if (err) {
            console.error('Erro ao adicionar item ao pedido:', err);
            return res.status(500).json({ error: 'Erro ao adicionar item ao pedido' });
        }
        res.json({ message: 'Item adicionado ao pedido com sucesso', id_item: result.insertId });
    });
});

// Rota para atualizar a quantidade de um item no pedido
router.put('/:pedidoId/item/:itemId', (req, res) => {
    const { pedidoId, itemId } = req.params;
    const { quantidade, preco_total } = req.body;
    const sql = 'UPDATE itens_pedido SET quantidade = ?, preco_total = ? WHERE id_item = ? AND id_pedido = ?';

    db.query(sql, [quantidade, preco_total, itemId, pedidoId], (err, result) => {
        if (err) {
            console.error('Erro ao atualizar item do pedido:', err);
            return res.status(500).json({ error: 'Erro ao atualizar item do pedido' });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Item do pedido não encontrado' });
        }
        res.json({ message: 'Item do pedido atualizado com sucesso' });
    });
});

// Rota para remover um item de um pedido
router.delete('/:pedidoId/item/:itemId', (req, res) => {
    const { pedidoId, itemId } = req.params;
    const sql = 'DELETE FROM itens_pedido WHERE id_item = ? AND id_pedido = ?';

    db.query(sql, [itemId, pedidoId], (err, result) => {
        if (err) {
            console.error('Erro ao excluir item do pedido:', err);
            return res.status(500).json({ error: 'Erro ao excluir item do pedido' });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Item do pedido não encontrado' });
        }
        res.json({ message: 'Item do pedido excluído com sucesso' });
    });
});

module.exports = router;
