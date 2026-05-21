const path = require('path');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();

// Sécurité et Middleware 
app.use(helmet());
app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

app.get('/articles', async (req, res) => {
    const start = Date.now();
    try {
        const result = await pool.query('SELECT * FROM articles');

        const duration = Date.now() - start;
        console.log(`[INFO] Requête catalogue traitée en ${duration}ms`);

        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: "Erreur serveur", detail: err.message });
    }
});

app.get('/health', (req, res) => res.status(200).send('OK'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Serveur Collector démarré sur le port ${PORT}`);
});

module.exports = app;