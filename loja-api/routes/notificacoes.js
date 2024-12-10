const express = require('express');
const router = express.Router();
const db = require('../db');

//rota para listar todas as notificações do cliente
router.get('/', (req, res) => {
    const { id_cliente } = req.query;

    if (!id_cliente) {
        return res.status(404).json({ error: 'o id do Cliente é obrigatorio' });
    }
    const sql = 'SELECT * FROM notificacoes WHERE id_cliente = ?';
    db.query(sql, [id_cliente], (err, results) => {
        if (err) {
            console.error('Erro ao buscar notificações:', err);
            return res.status(500).json({ error: 'Erro ao buscar notificações' });
        }
        res.json(results);
    });
});

// marcar uma notificação como lida
router.post('/:id', (req, res) => {
    const {id} = req.params;
    const {lida} = req.body;

    if (lida === undefined){
        return res.status(404).json({ error: 'O status "lida" é obrigatorio' });
    }

    const sql = 'UPDATE  notificacoes SET lida = ? WHERE id_notificacao =';
    
    db.query(sql, [ id, , lida], (err, result) => {
        if (err) {
            console.error('Erro ao atualizar notificação:', err);
            return res.status(500).json({ error: 'Erro ao atualizar notificação' });
        }
        res.json({ mensage: 'Notificação atualizada com sucesso!' });
    });
});



//excluir produto da lista de favoritos
router.delete('/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM notificacoes WHERE id_notificacao = ?';

    db.query(sql, [id], (err, result) => {
        if (err) {
            console.error('Erro ao remover a notifação', err);
            return res.status(500).json({ error: 'Erro ao remover a notificação' });
        }
        if (result.affectedrows === 0) {
            return res.status(404).json({ mensage: 'Notificação não encontrado ' });
        }
        res.json({ message: 'Notificação removida com sucesso!' });
    })
});

module.exports = router;