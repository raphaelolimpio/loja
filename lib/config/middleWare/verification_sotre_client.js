const checkClient = require('../utils/checkClient');
const checkStore = require('../utils/checkStore');

const verificaClienteLojaMiddleware = async (req, res, next) => {
    const { id_dono_loja, id_cliente } = req.body || req.query;

    if (!id_dono_loja || !id_cliente) {
        return res.status(400).json({ error: 'ID do dono da loja e ID do cliente são obrigatórios' });
    }

    try {
        const donoValido = await checkStore(id_dono_loja);
        if (!donoValido) {
            return res.status(404).json({ error: `Dono da loja não encontrado para o ID: ${id_dono_loja}` });
        }

        const clienteValido = await checkClient(id_cliente, id_dono_loja);
        if (!clienteValido) {
            return res.status(404).json({ error: `Cliente não encontrado para o ID: ${id_cliente} e dono da loja ID: ${id_dono_loja}` });
        }

        next();
    } catch (err) {
        console.error('Erro no middleware de verificação:', err);
        res.status(500).json({ error: 'Erro ao verificar dados do cliente ou dono da loja' });
    }
};


module.exports = verificaClienteLojaMiddleware;
