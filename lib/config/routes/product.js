const express = require('express');
const router = express.Router();
const db = require('../db/db');
const verificaDonoLoja = require('../utils/verificaDonoLoja');


router.get('/', async (req, res) => {
    const { id_dono_loja } = req.query;

    try {

        const donoExiste = await verificaDonoLoja(id_dono_loja);
        if (!donoExiste) {
            return res.status(404).json({ message: 'Dono da loja não encontrado' });
        }
        const sql = 'SELECT * FROM produtos WHERE id_dono_loja = ?';
        db.query(sql, [id_dono_loja], (err, results) => {
            if (err) {
                console.error('Erro ao buscar produtos:', err);
                return res.status(500).json({ error: 'Erro ao buscar produtos' });
            }
            res.json(results);
        });
    } catch (err) {
        console.error('Erro no processo de verificação:', err);
        return res.status(500).json({ error: 'Erro ao verificar loja' });
    }
});

router.get('/:id', async (req, res) => {
    const { id } = req.params;
    const { id_dono_loja } = req.query;

    try {
        const donoExiste = await verificaDonoLoja(id_dono_loja);
        if (!donoExiste) {
            return res.status(404).json({ message: 'Dono da loja não encontrado' });
        }
        const sql = 'SELECT * FROM produtos WHERE id_produto = ? AND id_dono_loja = ?';
        db.query(sql, [id, id_dono_loja], (err, result) => {
            if (err) {
                console.error('Erro ao buscar produto:', err);
                return res.status(500).json({ error: 'Erro ao buscar produto' });
            }
            if (result.length === 0) {
                return res.status(404).json({ message: 'Produto não encontrado ou não pertence à loja' });
            }
            res.json(result[0]);
        });
    } catch (err) {
        console.error('Erro no processo de verificação:', err);
        return res.status(500).json({ error: 'Erro ao verificar loja' });
    }
});

router.post('/', async (req, res) => {
    const { nome, descricao, preco, estoque, imagem_url, id_categoria, id_dono_loja } = req.body;

    try {
        const donoExiste = await verificaDonoLoja(id_dono_loja);
        if (!donoExiste) {
            return res.status(404).json({ message: 'Dono da loja não encontrado' });
        }

        // Adiciona o novo produto à loja
        const sql = 'INSERT INTO produtos (nome, descricao, preco, estoque, imagem_url, id_categoria, id_dono_loja) VALUES (?, ?, ?, ?, ?, ?, ?)';
        db.query(sql, [nome, descricao, preco, estoque, imagem_url, id_categoria, id_dono_loja], (err, result) => {
            if (err) {
                console.error('Erro ao adicionar produto:', err);
                return res.status(500).json({ error: 'Erro ao criar produto' });
            }
            res.json({ message: 'Produto adicionado com sucesso', id: result.insertId });
        });
    } catch (err) {
        console.error('Erro no processo de verificação:', err);
        return res.status(500).json({ error: 'Erro ao verificar loja' });
    }
});


router.put('/:id', (req, res) => {
    const { id } = req.params;
    const { nome, descricao, preco, estoque, imagem_url, id_categoria, id_dono_loja } = req.body;
    const sql = 'UPDATE produtos SET nome = ?, descricao = ?, preco = ?, estoque = ?, imagem_url = ?, id_categoria = ? WHERE id_produto = ? AND id_dono_loja = ?';
    db.query(sql, [nome, descricao, preco, estoque, imagem_url, id_categoria, id, id_dono_loja], (err, result) => {
        if (err) {
            console.error("Erro ao atualizar produto: ", err);
            return res.status(500).json({ error: 'Erro ao atualizar produto' });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Produto não encontrado ou não pertence à loja' });
        }
        res.json({ message: 'Produto atualizado com sucesso!' });
    });
});

router.delete('/:id', (req, res) => {
    const { id } = req.params;
    const { id_dono_loja } = req.query;
    const sql = 'DELETE FROM produtos WHERE id_produto = ? AND id_dono_loja = ?';

    db.query(sql, [id, id_dono_loja], (err, result) => {
        if (err) {
            console.error('Erro ao excluir produto:', err);
            return res.status(500).json({ error: 'Erro ao excluir produto' });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Produto não encontrado ou não pertence à loja' });
        }
        res.json({ message: 'Produto excluído com sucesso!' });
    });
});

module.exports = router;
