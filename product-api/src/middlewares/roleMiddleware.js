const roleMiddleware = (req, res, next) => {
    if (!req.user.isAdmin) {
        return res.status(403).json({ error: 'Acesso negado. Comando disponível apenas para administradores!' });
    }
    next();
};

module.exports = roleMiddleware;