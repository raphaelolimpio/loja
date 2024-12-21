const db = require('../db/db');

// Listar notificações do cliente
const listarNotificacoes = (req, res) => {
    const { id_cliente, id_dono_loja } = req.query;

    if (!id_cliente) {
        return res.status(400).json({ error: 'ID do cliente é obrigatório.' });
    }

    const sql = id_dono_loja
        ? 'SELECT * FROM notificacoes WHERE id_cliente = ? AND id_dono_loja = ?'
        : 'SELECT * FROM notificacoes WHERE id_cliente = ?';

    const params = id_dono_loja ? [id_cliente, id_dono_loja] : [id_cliente];

    db.query(sql, params, (err, results) => {
        if (err) {
            console.error('Erro ao buscar notificações:', err);
            return res.status(500).json({ error: 'Erro ao buscar notificações.' });
        }
        res.json(results);
    });
};


module.exports = {
    listarNotificacoes
};
