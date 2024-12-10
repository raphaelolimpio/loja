const express = require('express');
const router = express.Router();
const db = require('../db');

// lista de favoritos
router.get('/', (req, res) => {
    const { id_cliente } = req.query;
    if (!id_cliente) {
        return res.status(400).json({ error: 'O ID do cliente é obrigatório' });
    }
    const sql = 'SELECT * FROM favoritos WHERE id_cliente = ?';
    db.query(sql, [id_cliente], (err, results) => {
        if (err) {
            console.error('Erro ao buscar favoritos:', err);
            return res.status(500).json({ error: 'Erro ao buscar favoritos' });
        }
        res.json(results);
    });
});

// adicionar produto na lista de favoritos
router.post('/', (req, res) => {
    const { id_cliente, id_produto, data_adicionado } = req.body;
    if (!id_cliente || !id_produto) {
        return res.status(400).json({ error: 'ID do cliente e ID do produto são obrigatórios' });
    }

    const sql = 'INSERT INTO favoritos (id_favoritos, id_cliente, id_produto, data_adicionado ) VALUES (?, ?, ?)';
    db.query(sql, [id_cliente, id_produto, data_adicionado ], (err, result) => {
        if (err) {
            console.error('Erro ao adicionar produto nos favoritos:', err);
            return res.status(500).json({ error: 'Erro ao adicionar produto aos favoritos' });
        }
        res.json({ mensage: 'Produto adicionado a lista de favoritos com sucesso', id: result.insertId });
    });
});



//excluir produto da lista de favoritos
router.delete('/:id', (req, res) => {
    const {id} = req.params;
    const sql = 'DELETE FROM favoritos WHERE id_favoritos = ?';

    db.query(sql, [id], (err, result) => {
        if (err) {
            console.error('Erro ao remover produto de favoritos',err);
            return res.status(500).json({ error: 'Erro ao remover produto de favoritos' });
        }
        if (result.affectedrows === 0){
            return res.status(404).json({ mensage: 'Produto não encontrado '});
        }
        res.json({message: 'Produto removido com sucesso da lista de favoritos!'});
    })
});

module.exports = router;