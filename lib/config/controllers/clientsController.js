const db = require('../db/db');

const getAllClients = (req, res) => {
    db.query('SELECT * FROM clients', (err, results) => {
        if (err) {
            console.error('Erro ao buscar clientes:', err);
            return res.status(500).json({ error: 'Erro ao buscar clientes' });
        }
        res.status(200).json(results);
    });
};

const createClient = (req, res) => {
    const { name, email, phone } = req.body;
    const sql = 'INSERT INTO clients (name, email, phone) VALUES (?, ?, ?)';
    db.query(sql, [name, email, phone], (err, result) => {
        if (err) {
            console.error('Erro ao criar cliente:', err);
            return res.status(500).json({ error: 'Erro ao criar cliente' });
        }
        res.status(201).json({ message: 'Cliente criado com sucesso', clientId: result.insertId });
    });
};

module.exports = {
    getAllClients,
    createClient
};
