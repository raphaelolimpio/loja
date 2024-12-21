const db = require('../db');

const checkStore = async (id_dono_loja) => {
    const sql = 'SELECT * FROM donos_loja WHERE id_dono_loja = ?';
    try {
        const [results] = await db.promise().query(sql, [id_dono_loja]); 
        return results.length > 0;
    } catch (err) {
        console.error('Erro ao verificar o dono da loja:', err);
        throw new Error('Erro ao verificar o dono da loja');
    }
};

module.exports = checkStore;
