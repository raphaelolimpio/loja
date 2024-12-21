const express = require('express');
const router = express.Router();
const { listarNotificacoes } = require('../../lib/config/controllers/notificationsController');
const verificaClienteLojaMiddleware = require('../middlewares/verificaClienteLojaMiddleware');

router.get('/', verificaClienteLojaMiddleware, listarNotificacoes);

module.exports = router;

// Função para verificar se o cliente existe
const verificaCliente = (id_cliente, callback) => {
    const checkClienteSql = 'SELECT * FROM clientes WHERE id_cliente = ?';
    db.query(checkClienteSql, [id_cliente], (err, result) => {
        if (err) {
            console.error('Erro ao verificar o cliente:', err);
            return callback(err);
        }

        if (result.length === 0) {
            return callback(null, false); // Cliente não encontrado
        }

        callback(null, true); // Cliente encontrado
    });
};

// Função para verificar se o dono da loja existe
const verificaDonoLoja = (id_dono_loja, callback) => {
    const checkDonoLojaSql = 'SELECT * FROM donos_loja WHERE id_dono_loja = ?';
    db.query(checkDonoLojaSql, [id_dono_loja], (err, result) => {
        if (err) {
            console.error('Erro ao verificar o dono da loja:', err);
            return callback(err);
        }

        if (result.length === 0) {
            return callback(null, false); // Dono da loja não encontrado
        }

        callback(null, true); // Dono da loja encontrado
    });
};

// Rota para listar todas as notificações do cliente
router.get('/', (req, res) => {
    const { id_cliente, id_dono_loja } = req.query;

    if (!id_cliente) {
        return res.status(404).json({ error: 'O ID do cliente é obrigatório' });
    }

    // Verifica se o cliente existe
    verificaCliente(id_cliente, (err, clienteValido) => {
        if (err) {
            return res.status(500).json({ error: 'Erro ao verificar o cliente' });
        }

        if (!clienteValido) {
            return res.status(404).json({ error: 'Cliente não encontrado' });
        }

        // Verifica se o dono da loja existe
        if (id_dono_loja) {
            verificaDonoLoja(id_dono_loja, (err, donoLojaValido) => {
                if (err) {
                    return res.status(500).json({ error: 'Erro ao verificar o dono da loja' });
                }

                if (!donoLojaValido) {
                    return res.status(404).json({ error: 'Dono da loja não encontrado' });
                }

                // Se o cliente e o dono da loja existem, retornamos as notificações
                const sql = 'SELECT * FROM notificacoes WHERE id_cliente = ? AND id_dono_loja = ?';
                db.query(sql, [id_cliente, id_dono_loja], (err, results) => {
                    if (err) {
                        console.error('Erro ao buscar notificações:', err);
                        return res.status(500).json({ error: 'Erro ao buscar notificações' });
                    }
                    res.json(results);
                });
            });
        } else {
            // Se o id_dono_loja não for fornecido, busca apenas pelo id_cliente
            const sql = 'SELECT * FROM notificacoes WHERE id_cliente = ?';
            db.query(sql, [id_cliente], (err, results) => {
                if (err) {
                    console.error('Erro ao buscar notificações:', err);
                    return res.status(500).json({ error: 'Erro ao buscar notificações' });
                }
                res.json(results);
            });
        }
    });
});

// Marcar uma notificação como lida
router.post('/:id', (req, res) => {
    const { id } = req.params;
    const { lida } = req.body;

    if (lida === undefined) {
        return res.status(404).json({ error: 'O status "lida" é obrigatório' });
    }

    const sql = 'UPDATE notificacoes SET lida = ? WHERE id_notificacao = ?';
    db.query(sql, [lida, id], (err, result) => {
        if (err) {
            console.error('Erro ao atualizar notificação:', err);
            return res.status(500).json({ error: 'Erro ao atualizar notificação' });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Notificação não encontrada' });
        }
        res.json({ message: 'Notificação atualizada com sucesso!' });
    });
});

// Excluir notificação
router.delete('/', (req, res) => {
    const { id_cliente } = req.query;
  
    if (!id_cliente) {
      return res.status(400).json({ error: 'O ID do cliente é obrigatório' });
    }
  
    const sql = 'DELETE FROM notificacoes WHERE id_cliente = ?';
    db.query(sql, [id_cliente], (err, result) => {
      if (err) {
        console.error('Erro ao excluir notificações:', err);
        return res.status(500).json({ error: 'Erro ao excluir notificações' });
      }
      res.json({ message: 'Todas as notificações foram excluídas com sucesso!' });
    });
  });
  

module.exports = router;
