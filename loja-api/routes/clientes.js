const express = require('express');
const router = express.Router();
const db = require('../db');

//listar todos os clientes
router.get('/', (req, res) => {
    const sql = 'SELECT * FROM clientes';
    db.query(sql, (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});

// um unico cliente 
router.get('/:id', (req, res) => {
    const { id } = req.params; 
    const sql = 'SELECT * FROM clientes WHERE id_cliente = ?'; 

    db.query(sql, [id], (err, result) => {
        if (err) {
            console.error('Erro ao buscar cliente:', err);
            return res.status(500).json({ error: 'Erro ao buscar cliente' });
        }
        if (result.length === 0) {
            return res.status(404).json({ message: 'Cliente não encontrado' });
        }
        res.json(result[0]);
    });
});


// adicionar cliente
router.post('/', (req, res) => {
    const { nome, email, senha, telefone, endereco } = req.body;
    const sql = 'INSERT INTO clientes (nome, email, senha, telefone, endereco) VALUES (?, ?, ?, ?, ?)';
    db.query(sql, [nome, email, senha, telefone, endereco], (err, result) => {
        if (err) {
            console.error('Erro ao criar cliente:', err);
            return res.status(500).json({ error: 'Erro ao criar cliente' });
        }
        res.json({ mensage: 'Cliente adicionado com sucesso!', id: result.insertId });
    });
});

// atualizar cliente 
router.put('/:id', (req, res) => {
    const { id } = req.params;
    const { nome, email, senha, telefone, endereco } = req.body;
    const sql = 'UPDATE clientes SET nome = ?, email = ?, senha = ?, telefone = ?, endereco = ? WHERE id = ?';
    db.query(sql, [nome, descricao, preco, estoque, imagem_url, id_categoria], (err, result) => {
        if (err) {
            console.error("Erro ao atualizar cliente: ", err);
            return res.status(500).json({ error: 'Erro ao atualizar cliente' });
        }
        if (result.affectedrows === 0) {
            return res.status(404).json({ mensage: 'Cliente não encontrado' });
        }
        res.json({ message: 'Cliente atualizado com sucesso!' });
    });
});

//excluir cliente
router.delete('/:id', (req, res) => {
    const {id} = req.params;
    const sql = 'DELETE FROM clientes WHERE id_cliente = ?';

    db.query(sql, [id], (err, result) => {
        if (err) {
            console.error('Erro ao excluir cliente',err);
            return res.status(500).json({ error: 'Erro ao excluir cliente' });
        }
        if (result.affectedrows === 0){
            return res.status(404).json({ mensage: 'Cliente não encontrado'});
        }
        res.json({message: 'Cliente excluido com sucesso!'});
    })
});

module.exports = router;
