// utils/checkClient.js

const db = require('../db/db');

const checkClient = async (clientId, storeOwnerId) => {
    const sql = 'SELECT * FROM clientes WHERE id_cliente = ? AND id_dono_loja = ?';
    try {
        const [results] = await db.promise().query(sql, [clientId, storeOwnerId]);
        return results.length > 0;
    } catch (err) {
        console.error('Erro ao verificar cliente:', err);
        throw new Error('Erro ao verificar cliente');
    }
};


module.exports = checkClient;
