const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');
const { JWT_SECRET } = require('../config/jwt');
const { isValidCredentialString } = require('../utils/validation');

const router = express.Router();

router.post('/register', async (req, res) => {
    const { username, password } = req.body;

    if (!isValidCredentialString(username) || !isValidCredentialString(password)) {
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
        console.error('[ERROR]', err);
        res.status(500).json({ error: 'Erreur serveur' });
    }
});

router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    if (!isValidCredentialString(username) || !isValidCredentialString(password)) {
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
        console.error('[ERROR]', err);
        res.status(500).json({ error: 'Erreur serveur' });
    }
});

module.exports = router;
