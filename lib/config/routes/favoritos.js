const express = require('express');
const router = express.Router();
const db = require('../db');

// Listar favoritos de um cliente (considerando a loja à qual o cliente pertence)
router.get('/', (req, res) => {
    const { id_cliente, id_dono_loja } = req.query;

    // Verificação de parâmetros obrigatórios
    if (!id_cliente || !id_dono_loja) {
        return res.status(400).json({ error: 'O ID do cliente e o ID da loja são obrigatórios' });
    }

    // Verifica se o cliente pertence à loja antes de listar os favoritos
    const sql = `
        SELECT f.* 
        FROM favoritos f
        JOIN clientes c ON f.id_cliente = c.id_cliente 
        WHERE f.id_cliente = ? 
        AND c.id_dono_loja = ?
    `;

    db.query(sql, [id_cliente, id_dono_loja], (err, results) => {
        if (err) {
            console.error('Erro ao buscar favoritos:', err);
            return res.status(500).json({ error: 'Erro ao buscar favoritos' });
        }
        res.json(results);
    });
});

// Adicionar produto à lista de favoritos (verificando a loja do cliente)
router.post('/', (req, res) => {
    const { id_cliente, id_produto, id_dono_loja, data_adicionado } = req.body;

    // Verificação de parâmetros obrigatórios
    if (!id_cliente || !id_produto || !id_dono_loja) {
        return res.status(400).json({ error: 'ID do cliente, ID do produto e ID da loja são obrigatórios' });
    }

    // Verifica se o cliente pertence à loja e adiciona o produto aos favoritos
    const sql = `
        INSERT INTO favoritos (id_cliente, id_produto, data_adicionado) 
        SELECT ?, ?, ? 
        FROM clientes 
        WHERE id_cliente = ? 
        AND id_dono_loja = ?
    `;

    db.query(sql, [id_cliente, id_produto, data_adicionado, id_cliente, id_dono_loja], (err, result) => {
        if (err) {
            console.error('Erro ao adicionar favorito:', err);
            return res.status(500).json({ error: 'Erro ao adicionar favorito' });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Cliente não encontrado ou não pertence à loja' });
        }
        res.json({ message: 'Produto adicionado aos favoritos com sucesso', id: result.insertId });
    });
});

// Excluir produto dos favoritos (verificando a loja do cliente)
router.delete('/:id', (req, res) => {
    const { id } = req.params;
    const { id_cliente, id_dono_loja } = req.query;

    // Verificação de parâmetros obrigatórios
    if (!id_cliente || !id_dono_loja) {
        return res.status(400).json({ error: 'O ID do cliente e o ID da loja são obrigatórios' });
    }

    // Verifica se o cliente pertence à loja e exclui o favorito
    const sql = `
        DELETE f 
        FROM favoritos f 
        JOIN clientes c ON f.id_cliente = c.id_cliente 
        WHERE f.id_favorito = ? 
        AND f.id_cliente = ? 
        AND c.id_dono_loja = ?
    `;

    db.query(sql, [id, id_cliente, id_dono_loja], (err, result) => {
        if (err) {
            console.error('Erro ao remover favorito:', err);
            return res.status(500).json({ error: 'Erro ao remover favorito' });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Favorito não encontrado ou não pertence ao cliente' });
        }
        res.json({ message: 'Favorito removido com sucesso!' });
    });
});

module.exports = router;
