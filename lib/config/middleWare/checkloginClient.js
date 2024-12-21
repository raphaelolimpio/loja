const checkLoginClient = (req, res, next) => {
    const token = req.headers.authorization && req.headers.authorization.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Token não fornecido' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.client = decoded;
        next();
    } catch (err) {
        console.error('Erro ao verificar token:', err);
        res.status(401).json({ error: 'Token inválido' });
    }
};


module.exports = checkLoginClient;
