const express = require('express');
const bcrypt = require('bcrypt'); // Para criptografar a senha
const router = express.Router();
const db = require('../db');
const saltRounds = 10;

// Função de middleware para validar os dados de entrada do login
const checkLogin = (req, res, next) => {
    const { email, senha } = req.body;
    if (!email || !senha) {
        return res.status(400).json({ error: 'Email e senha são obrigatórios.' });
    }

    // Validar formato do e-mail
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ error: 'Email inválido.' });
    }

    next();
};

// 🔵 Detalhes de um único dono
router.get('/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'SELECT id_dono, nome, email, telefone, endereco FROM donos WHERE id_dono = ?';

    db.query(sql, [id], (err, result) => {
        if (err) {
            console.error('Erro ao buscar dono:', err);
            return res.status(500).json({ error: 'Erro ao buscar dono' });
        }
        if (result.length === 0) {
            return res.status(404).json({ message: 'Dono não encontrado' });
        }
        res.json(result[0]);
    });
});

// 🔵 Criar um novo dono (senha com hash) - agora com checkExistingEmail
const checkExistingEmail = require('../utils/checkExistingEmail');
router.post('/', checkExistingEmail, async (req, res) => {
    const { nome, email, senha, telefone, endereco } = req.body;
    if (!nome || !email || !senha || !telefone || !endereco) {
        return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
    }
    try {
        const hashedPassword = await bcrypt.hash(senha, saltRounds);
        const sql = 'INSERT INTO donos (nome, email, senha, telefone, endereco) VALUES (?, ?, ?, ?, ?)';
        db.query(sql, [nome, email, hashedPassword, telefone, endereco], (err, result) => {
            if (err) {
                console.error('Erro ao criar dono:', err);
                return res.status(500).json({ error: 'Erro ao criar dono' });
            }
            res.json({ message: 'Dono criado com sucesso', id: result.insertId });
        });
    } catch (error) {
        console.error('Erro ao criptografar senha:', error);
        res.status(500).json({ error: 'Erro interno no servidor' });
    }
});

// 🔵 Atualizar informações de um dono
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { nome, email, senha, telefone, endereco } = req.body;
    const hashedPassword = await bcrypt.hash(senha, saltRounds);
    const sql = 'UPDATE donos SET nome = ?, email = ?, senha = ?, telefone = ?, endereco = ? WHERE id_dono = ?';

    db.query(sql, [nome, email, hashedPassword, telefone, endereco, id], (err, result) => {
        if (err) {
            console.error("Erro ao atualizar dono:", err);
            return res.status(500).json({ error: 'Erro ao atualizar dono' });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Dono não encontrado' });
        }
        res.json({ message: 'Dono atualizado com sucesso' });
    });
});

// 🔵 Excluir um dono
router.delete('/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM donos WHERE id_dono = ?';

    db.query(sql, [id], (err, result) => {
        if (err) {
            console.error('Erro ao excluir dono:', err);
            return res.status(500).json({ error: 'Erro ao excluir dono' });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Dono não encontrado' });
        }
        res.json({ message: 'Dono excluído com sucesso' });
    });
});

// 🔵 Rota de Login
router.post('/login', checkLogin, (req, res) => {
    const { email, senha } = req.body;
    const sql = 'SELECT * FROM donos WHERE email = ?';

    db.query(sql, [email], async (err, result) => {
        if (err) {
            console.error('Erro ao verificar dono:', err);
            return res.status(500).json({ error: 'Erro ao verificar dono' });
        }
        if (result.length === 0) {
            return res.status(404).json({ error: 'Dono não encontrado' });
        }

        const dono = result[0];
        
        // Comparar a senha fornecida com a senha armazenada
        const senhaCorreta = await bcrypt.compare(senha, dono.senha);
        
        if (!senhaCorreta) {
            return res.status(400).json({ error: 'Senha incorreta' });
        }
        
        res.json({ message: 'Login realizado com sucesso', dono });
    });
});

module.exports = router;
