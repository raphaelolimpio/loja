const checkStore = require('../utils/checkStore'); // Função que verifica a loja

const verificaDonoLojaMiddleware = async (req, res, next) => {
    const { id_dono_loja } = req.body || req.query;

    // Verificar se o ID do dono da loja foi fornecido
    if (!id_dono_loja) {
        return res.status(400).json({ error: 'ID do dono da loja é obrigatório' });
    }

    try {
        // Verifica se o dono da loja existe usando a função checkStore
        const donoValido = await checkStore(id_dono_loja);
        if (!donoValido) {
            return res.status(404).json({ error: `Dono da loja não encontrado para o ID: ${id_dono_loja}` });
        }

        next(); // Se o dono for válido, continua para o próximo middleware ou rota
    } catch (err) {
        console.error('Erro no middleware de verificação do dono da loja:', err);
        res.status(500).json({ error: 'Erro ao verificar dados do dono da loja' });
    }
};

module.exports = verificaDonoLojaMiddleware;
