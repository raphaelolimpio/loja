const db = require('../db/db');

// Listar favoritos de um cliente
const listarFavoritos = (req, res) => {
    const { id_cliente, id_dono_loja } = req.query;

    if (!id_cliente || !id_dono_loja) {
        return res.status(400).json({ error: 'ID do cliente e ID da loja são obrigatórios.' });
    }

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
            return res.status(500).json({ error: 'Erro ao buscar favoritos.' });
        }
        res.json(results);
    });
};

module.exports = {
    listarFavoritos
};
