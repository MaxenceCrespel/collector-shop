function notFoundHandler(req, res) {
    res.status(404).json({ error: 'Route non trouvée' });
}

function errorHandler(err, req, res, next) {
    console.error('[ERROR]', err);
    res.status(err.status || 500).json({ error: 'Erreur serveur' });
}

module.exports = { notFoundHandler, errorHandler };
