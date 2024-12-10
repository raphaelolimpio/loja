const express = require('express');
const router = express.Router();
const db = require('../db');

// lista produtos
router.get('/', (req, res) => {
    const sql = 'SELECT * FROM produtos';
    db.query(sql, (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});

// um unico produto
router.get('/:id', (req, res) => {
    const { id } = req.params; 
    const sql = 'SELECT * FROM produtos WHERE id_produto = ?'; 

    db.query(sql, [id], (err, result) => {
        if (err) {
            console.error('Erro ao buscar produto:', err);
            return res.status(500).json({ error: 'Erro ao buscar produto' });
        }
        if (result.length === 0) {
            return res.status(404).json({ message: 'Produto não encontrado' });
        }
        res.json(result[0]);
    });
});

// adicionar produto
router.post('/', (req, res) => {
    const { nome, descricao, preco, estoque, imagem_url, id_categoria } = req.body;
    const sql = 'INSERT INTO produtos (nome, descricao, preco, estoque, imagem_url, id_categoria) VALUES (?, ?, ?, ?, ?, ?)';
    db.query(sql, [nome, descricao, preco, estoque, imagem_url, id_categoria], (err, result) => {
        if (err) {
            console.error('Erro ao produto:', err);
            return res.status(500).json({ error: 'Erro ao criar produto' });
        }
        res.json({ mensage: 'Produto adicionado com sucesso', id: result.insertId });
    });
});


// atualizar produto
router.put('/:id', (req, res) => {
    const { id } = req.params;
    const { nome, descricao, preco, estoque, imagem_url, id_categoria } = req.body;
    const sql = 'UPDATE produtos SET nome = ?, descricao = ?, preco = ?, estoque = ?, imagem_url = ?, id_categoria = ? WHERE id = ?';
    db.query(sql, [nome, descricao, preco, estoque, imagem_url, id_categoria], (err, result) => {
        if (err) {
            console.error("Erro ao atualizar produto: ", err);
            return res.status(500).json({ error: 'Erro ao atualizar produto' });
        }
        if (result.affectedrows === 0) {
            return res.status(404).json({ mensage: 'Produto não encontrado' });
        }
        res.json({ message: 'Produto atualizado com sucesso!' });
    });
});

//excluir produto
router.delete('/:id', (req, res) => {
    const {id} = req.params;
    const sql = 'DELETE FROM produtos WHERE id_produto = ?';

    db.query(sql, [id], (err, result) => {
        if (err) {
            console.error('Erro ao excluir produto',err);
            return res.status(500).json({ error: 'Erro ao excluir produto' });
        }
        if (result.affectedrows === 0){
            return res.status(404).json({ mensage: 'Produto não encontrado'});
        }
        res.json({message: 'Produto exluido com sucesso!'});
    })
});

module.exports = router;