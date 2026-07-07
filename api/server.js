const path = require('path');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const bcrypt = require('bcrypt');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_pour_le_cube';

app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

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

const promClient = require('prom-client');
promClient.collectDefaultMetrics({ timeout: 5000 });
app.get('/metrics', async (req, res) => {
    res.set('Content-Type', promClient.register.contentType);
    res.end(await promClient.register.metrics());
});

app.post('/register', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: 'Identifiant et mot de passe requis' });
    }
    if (username.length < 3) {
        return res.status(400).json({ error: 'L\'identifiant doit contenir au moins 3 caractères' });
    }
    if (password.length < 6) {
        return res.status(400).json({ error: 'Le mot de passe doit contenir au moins 6 caractères' });
    }

    try {
        const existing = await pool.query('SELECT id FROM users WHERE username = $1', [username]);
        if (existing.rows.length > 0) {
            return res.status(409).json({ error: 'Cet identifiant est déjà pris' });
        }

        const password_hash = await bcrypt.hash(password, 10);
        await pool.query(
            'INSERT INTO users (username, password_hash) VALUES ($1, $2)',
            [username, password_hash]
        );

        const token = jwt.sign({ username, role: 'user' }, JWT_SECRET, { expiresIn: '1h' });
        res.status(201).json({ token, username });
    } catch (err) {
        res.status(500).json({ error: 'Erreur serveur', detail: err.message });
    }
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: 'Identifiant et mot de passe requis' });
    }

    try {
        const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
        if (result.rows.length === 0) {
            return res.status(401).json({ error: 'Identifiants invalides' });
        }

        const user = result.rows[0];
        const valid = await bcrypt.compare(password, user.password_hash);
        if (!valid) {
            return res.status(401).json({ error: 'Identifiants invalides' });
        }

        const token = jwt.sign({ username: user.username, role: 'user' }, JWT_SECRET, { expiresIn: '1h' });
        res.json({ token, username: user.username });
    } catch (err) {
        res.status(500).json({ error: 'Erreur serveur', detail: err.message });
    }
});

app.get('/articles', async (req, res) => {
    const start = Date.now();
    try {
        const result = await pool.query('SELECT * FROM articles ORDER BY id DESC');
        console.log(`[INFO] Requête catalogue traitée en ${Date.now() - start}ms`);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: 'Erreur serveur', detail: err.message });
    }
});

app.post('/articles', authMiddleware, async (req, res) => {
    const { title, description, price, category } = req.body;
    const seller = req.user.username;
    try {
        const result = await pool.query(
            'INSERT INTO articles (title, description, price, category, seller) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [title, description, price, category, seller]
        );
        res.status(201).json({ message: 'Article ajouté', article: result.rows[0] });
    } catch (err) {
        res.status(500).json({ error: 'Erreur serveur lors de l\'ajout', detail: err.message });
    }
});

app.get('/health', (req, res) => res.status(200).send('OK'));

async function seedDemoUsers() {
    const demoUsers = [
        'sneakerhead75', 'starwars_collector', 'retro_passion',
        'pixel_hunter', 'pokemasterfr', 'marvel_addict', 'retrotech', 'brick_maniac'
    ];
    const demoPassword = 'collector2026';

    try {
        for (const username of demoUsers) {
            const existing = await pool.query('SELECT id FROM users WHERE username = $1', [username]);
            if (existing.rows.length === 0) {
                const hash = await bcrypt.hash(demoPassword, 10);
                await pool.query(
                    'INSERT INTO users (username, password_hash) VALUES ($1, $2)',
                    [username, hash]
                );
                console.log(`[SEED] Compte créé : ${username}`);
            }
        }
    } catch (err) {
        console.error('[SEED] Erreur lors du seed des comptes de démo :', err.message);
    }
}

const PORT = process.env.PORT || 3000;
if (process.env.NODE_ENV !== 'test') {
    app.listen(PORT, async () => {
        console.log(`Serveur Collector démarré sur le port ${PORT}`);
        await seedDemoUsers();
    });
}

module.exports = app;