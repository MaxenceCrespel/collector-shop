const path = require('path');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();

const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_pour_le_cube';

app.use(helmet({
    contentSecurityPolicy: false,
}));
app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Non autorisé — Token manquant' });
    }

    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(403).json({ error: 'Token invalide ou expiré' });
    }
};

app.post('/login', (req, res) => {
    const { username, password } = req.body;

    if (username === 'admin' && password === 'collector2026') {
        const token = jwt.sign({ username: 'admin', role: 'admin' }, JWT_SECRET, { expiresIn: '1h' });
        return res.json({ token });
    }

    res.status(401).json({ error: 'Identifiants invalides' });
});

app.get('/articles', async (req, res) => {
    const start = Date.now();
    try {
        const result = await pool.query('SELECT * FROM articles ORDER BY id DESC');

        const duration = Date.now() - start;
        console.log(`[INFO] Requête catalogue traitée en ${duration}ms`);

        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: "Erreur serveur", detail: err.message });
    }
});

app.post('/articles', authMiddleware, async (req, res) => {
    const { title, description, price, category } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO articles (title, description, price, category) VALUES ($1, $2, $3, $4) RETURNING *',
            [title, description, price, category]
        );
        res.status(201).json({ message: "Objet collector ajouté avec succès", article: result.rows[0] });
    } catch (err) {
        res.status(500).json({ error: "Erreur serveur lors de l'ajout", detail: err.message });
    }
});

app.get('/health', (req, res) => res.status(200).send('OK'));

const PORT = process.env.PORT || 3000;

if (process.env.NODE_ENV !== 'test') {
    app.listen(PORT, () => {
        console.log(`Serveur Collector démarré sur le port ${PORT}`);
    });
}

module.exports = app;