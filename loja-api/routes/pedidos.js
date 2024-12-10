const express = require('express');
const router = express.Router();
const db = require('../db');

// lista pedidos
router.get('/', (req, res) => {
    const sql = 'SELECT * FROM pedidos';
    db.query(sql, (err, results) => {
        if (err) {
            console.error('Erro ao buscar pedidos:', err);
            return res.status(500).json({ error: 'Erro ao buscar pedidos' });
        };
        res.json(results);
    });
});

// um unico pedido
router.get('/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'SELECT * FROM pedidos WHERE id_pedido = ?';

    db.query(sql, [id], (err, result) => {
        if (err) {
            console.error('Erro ao buscar pedido:', err);
            return res.status(500).json({ error: 'Erro ao buscar pedido' });
        }
        if (result.length === 0) {
            return res.status(404).json({ message: 'Pedido não encontrado' });
        }
        res.json(result[0]);
    });
});

// adicionar pedido
router.post('/', (req, res) => {
    const { id_cliente, total, status, endereco_entrega } = req.body;
    const sql = 'INSERT INTO pedidos (id_cliente, total, status, endereco_entrega) VALUES (?, ?, ?, ?)';
    db.query(sql, [id_cliente, total, status, endereco_entrega], (err, result) => {
        if (err) {
            console.error('Erro ao criar pedido:', err);
            return res.status(500).json({ error: 'Erro ao criar pedido' });
        }
        res.json({ mensage: 'Produto adicionado com sucesso', id: result.insertId });
    });
});


// atualizar status de um pedido
router.put('/:id', (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    const sql = 'UPADATE pedidos SET status = ? WHERE id_pedido = ?' ;
    db.query(sql, [status, id], (err, result) => {
        if (err) {
            console.error("Erro ao atualizar pedido: ", err);
            return res.status(500).json({ error: 'Erro ao atualizar pedido' });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ mensage: 'Pedido não encontrado' });
        }
        res.json({ message: 'Pedido atualizado com sucesso!' });
    });
});

//excluir pedido
router.delete('/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM pedidos WHERE id_pedido = ?';

    db.query(sql, [id], (err, result) => {
        if (err) {
            console.error('Erro ao excluir pedido', err);
            return res.status(500).json({ error: 'Erro ao excluir pedido' });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ mensage: 'Pedido não encontrado' });
        }
        res.json({ message: 'Pedido excluido com sucesso!' });
    })
});

module.exports = router;