const express = require('express');
const router = express.Router();
const db = require('../db/db');
const verificaClienteLojaMiddleware = require('../middlewares/verificaClienteLojaMiddleware');

// Rota para listar todos os itens de um pedido
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

// Rota para adicionar um item ao pedido
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
  

module.exports = router;
