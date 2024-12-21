const express = require('express');
require('dotenv').config();
const router = express.Router();
const db = require('../db/db');

// Lista carrinho de um cliente específico (com base no cliente e loja)
router.get('/:id_cliente', (req, res) => {
    const { id_cliente } = req.params;
    const sql = `
        SELECT c.*, p.nome, p.descricao, p.imagem_url 
        FROM carrinho c 
        JOIN produtos p ON c.id_produto = p.id_produto 
        JOIN clientes cli ON c.id_cliente = cli.id_cliente 
        WHERE c.id_cliente = ? AND c.id_loja = cli.id_loja
    `;
    db.query(sql, [id_cliente], (err, results) => {
        if (err) {
            console.error('Erro ao buscar carrinho:', err);
            return res.status(500).json({ error: 'Erro ao buscar carrinho' });
        }
        res.json(results);
    });
});

// Adicionar produto no carrinho (associado ao cliente e loja)
router.post('/', (req, res) => {
    const { id_cliente, id_produto, quantidade, preco_unitario, id_loja } = req.body;

    if (quantidade < 1) {
        return res.status(400).json({ error: 'A quantidade deve ser pelo menos 1' });
    }

    // Verifica se o cliente está vinculado à loja
    const checkClientShopSql = 'SELECT * FROM clientes WHERE id_cliente = ? AND id_loja = ?';
    db.query(checkClientShopSql, [id_cliente, id_loja], (err, results) => {
        if (err) {
            console.error('Erro ao verificar a loja do cliente:', err);
            return res.status(500).json({ error: 'Erro ao validar o cliente e a loja' });
        }
        if (results.length === 0) {
            return res.status(403).json({ message: 'Cliente não está vinculado a esta loja' });
        }

        // Verifica se o produto já está no carrinho
        const checkProductSql = 'SELECT * FROM carrinho WHERE id_cliente = ? AND id_produto = ? AND id_loja = ?';
        db.query(checkProductSql, [id_cliente, id_produto, id_loja], (err, results) => {
            if (err) {
                console.error('Erro ao verificar produto no carrinho:', err);
                return res.status(500).json({ error: 'Erro ao verificar o produto no carrinho' });
            }

            if (results.length > 0) {
                // Atualiza a quantidade se o produto já estiver no carrinho
                const newQuantity = results[0].quantidade + quantidade;
                const updateSql = 'UPDATE carrinho SET quantidade = ? WHERE id_carrinho = ?';
                db.query(updateSql, [newQuantity, results[0].id_carrinho], (err) => {
                    if (err) {
                        console.error('Erro ao atualizar produto no carrinho:', err);
                        return res.status(500).json({ error: 'Erro ao atualizar produto no carrinho' });
                    }
                    res.json({ message: 'Quantidade do produto atualizada no carrinho!' });
                });
            } else {
                // Adiciona um novo produto ao carrinho
                const insertSql = 'INSERT INTO carrinho (id_cliente, id_produto, quantidade, preco_unitario, id_loja) VALUES (?, ?, ?, ?, ?)';
                db.query(insertSql, [id_cliente, id_produto, quantidade, preco_unitario, id_loja], (err, result) => {
                    if (err) {
                        console.error('Erro ao adicionar produto ao carrinho:', err);
                        return res.status(500).json({ error: 'Erro ao adicionar produto ao carrinho' });
                    }
                    res.json({ message: 'Produto adicionado com sucesso', id: result.insertId });
                });
            }
        });
    });
});

// Atualizar quantidade do produto no carrinho
router.put('/:id', (req, res) => {
    const { id } = req.params;
    const { quantidade } = req.body;

    if (quantidade < 1) {
        return res.status(400).json({ error: 'A quantidade deve ser pelo menos 1' });
    }

    const sql = 'UPDATE carrinho SET quantidade = ? WHERE id_carrinho = ?';
    db.query(sql, [quantidade, id], (err, result) => {
        if (err) {
            console.error('Erro ao atualizar produto no carrinho:', err);
            return res.status(500).json({ error: 'Erro ao atualizar produto no carrinho' });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Item não encontrado no carrinho' });
        }
        res.json({ message: 'Quantidade do produto no carrinho atualizada com sucesso!' });
    });
});

// Excluir produto do carrinho
router.delete('/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM carrinho WHERE id_carrinho = ?';

    db.query(sql, [id], (err, result) => {
        if (err) {
            console.error('Erro ao remover produto do carrinho:', err);
            return res.status(500).json({ error: 'Erro ao remover produto do carrinho' });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Produto não encontrado no carrinho' });
        }
        res.json({ message: 'Produto removido do carrinho com sucesso!' });
    });
});

module.exports = router;
