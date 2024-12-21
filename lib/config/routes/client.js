const express = require('express');
const router = express.Router();
const db = require('../db');
const bcrypt = require('bcrypt');
const verificaClienteLojaMiddleware = require('../middleware/verificaClienteLojaMiddleware');  // Middleware

const saltRounds = 10;
const jwt = require('jsonwebtoken');

const createToken = (user) => {
    return jwt.sign({ id_cliente: user.id_cliente }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

// Listar todos os clientes de uma loja (vinculados ao dono)
router.get('/', (req, res) => {
    const { id_dono_loja } = req.query;
    const sql = 'SELECT * FROM clientes WHERE id_dono_loja = ?';
    db.query(sql, [id_dono_loja], (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});

// Buscar um único cliente de uma loja
router.get('/:id', verificaClienteLojaMiddleware, (req, res) => {
    const { id } = req.params;
    const { id_dono_loja } = req.query;

    const sql = 'SELECT * FROM clientes WHERE id_cliente = ? AND id_dono_loja = ?';
    db.query(sql, [id, id_dono_loja], (err, result) => {
        if (err) {
            console.error('Erro ao buscar cliente:', err);
            return res.status(500).json({ error: 'Erro ao buscar cliente' });
        }
        if (result.length === 0) {
            return res.status(404).json({ message: 'Cliente não encontrado' });
        }
        res.json(result[0]);
    });
});

// Adicionar cliente
router.post('/', async (req, res) => {
    const { nome, email, senha, telefone, endereco, id_dono_loja } = req.body;
    if (!nome || !email || !senha || !telefone || !endereco || !id_dono_loja) {
        return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
    }

    const emailExistsSql = 'SELECT * FROM clientes WHERE email = ?';
    db.query(emailExistsSql, [email], async (err, result) => {
        if (err) {
            console.error('Erro ao verificar e-mail:', err);
            return res.status(500).json({ error: 'Erro ao verificar e-mail' });
        }
        if (result.length > 0) {
            return res.status(400).json({ error: 'Este e-mail já está em uso' });
        }

        try {
            const hashedPassword = await bcrypt.hash(senha, saltRounds);

            const sql = 'INSERT INTO clientes (nome, email, senha, telefone, endereco, id_dono_loja) VALUES (?, ?, ?, ?, ?, ?)';
            db.query(sql, [nome, email, hashedPassword, telefone, endereco, id_dono_loja], (err, result) => {
                if (err) {
                    console.error('Erro ao criar cliente:', err);
                    return res.status(500).json({ error: 'Erro ao criar cliente' });
                }
                res.json({ message: 'Cliente adicionado com sucesso!', id: result.insertId });
            });
        } catch (error) {
            console.error('Erro ao criptografar senha:', error);
            res.status(500).json({ error: 'Erro interno no servidor' });
        }
    });
});

// Atualizar cliente
router.put('/:id', verificaClienteLojaMiddleware, async (req, res) => {
    const { id } = req.params;
    const { nome, email, senha, telefone, endereco, id_dono_loja } = req.body;

    const sql = 'UPDATE clientes SET nome = ?, email = ?, senha = ?, telefone = ?, endereco = ? WHERE id_cliente = ? AND id_dono_loja = ?';
    db.query(sql, [nome, email, senha, telefone, endereco, id, id_dono_loja], (err, result) => {
        if (err) {
            console.error("Erro ao atualizar cliente: ", err);
            return res.status(500).json({ error: 'Erro ao atualizar cliente' });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Cliente não encontrado ou não pertence à loja' });
        }
        res.json({ message: 'Cliente atualizado com sucesso!' });
    });
});

// Excluir cliente
router.delete('/:id', verificaClienteLojaMiddleware, (req, res) => {
    const { id } = req.params;
    const { id_dono_loja } = req.query;

    const sql = 'DELETE FROM clientes WHERE id_cliente = ? AND id_dono_loja = ?';
    db.query(sql, [id, id_dono_loja], (err, result) => {
        if (err) {
            console.error('Erro ao excluir cliente', err);
            return res.status(500).json({ error: 'Erro ao excluir cliente' });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Cliente não encontrado ou não pertence à loja' });
        }
        res.json({ message: 'Cliente excluído com sucesso!' });
    });
});

// Login do cliente
router.post('/login', checkLoginClient, async (req, res) => {
    const { email, senha } = req.body;
    const sql = 'SELECT * FROM clientes WHERE email = ?';

    db.query(sql, [email], async (err, result) => {
        if (err) {
            console.error('Erro ao verificar cliente:', err);
            return res.status(500).json({ error: 'Erro ao verificar cliente' });
        }
        if (result.length === 0) {
            console.warn('Cliente não encontrado para o email:', email);
            return res.status(404).json({ error: 'Cliente não encontrado' });
        }

        const cliente = result[0];
        const senhaCorreta = await bcrypt.compare(senha, cliente.senha);

        if (!senhaCorreta) {
            console.warn('Senha incorreta para o email:', email);
            return res.status(400).json({ error: 'Senha incorreta' });
        }

        const token = createToken(cliente);

        res.json({ message: 'Login bem-sucedido', token });
    });
});

module.exports = router;
