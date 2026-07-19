const express = require('express');
const pool = require('../config/db');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

const ALLOWED_CONDITIONS = ['Neuf', 'Très bon état', 'Usé', 'Non spécifié'];

router.get('/articles', async (req, res) => {
    const start = Date.now();
    try {
        const result = await pool.query('SELECT * FROM articles ORDER BY id DESC');
        console.log(`[INFO] Requête catalogue traitée en ${Date.now() - start}ms`);
        res.json(result.rows);
    } catch (err) {
        console.error('[ERROR]', err);
        res.status(500).json({ error: 'Erreur serveur' });
    }
});

router.post('/articles', authMiddleware, async (req, res) => {
    const { title, description, price, category, condition } = req.body;

    if (typeof title !== 'string' || title.trim().length === 0 || title.length > 100) {
        return res.status(400).json({ error: 'Le titre est requis et doit faire au plus 100 caractères' });
    }
    if (typeof description !== 'string' || description.trim().length === 0) {
        return res.status(400).json({ error: 'La description est requise' });
    }
    if (typeof category !== 'string' || category.trim().length === 0 || category.length > 50) {
        return res.status(400).json({ error: 'La catégorie est requise et doit faire au plus 50 caractères' });
    }
    if (typeof price !== 'number' || !Number.isFinite(price) || price <= 0 || price > 99999999.99) {
        return res.status(400).json({ error: 'Le prix doit être un nombre positif' });
    }
    if (condition && !ALLOWED_CONDITIONS.includes(condition)) {
        return res.status(400).json({ error: "L'état spécifié pour l'objet est invalide" });
    }

    const articleCondition = condition || 'Non spécifié';
    const seller = req.user.username;
    try {
        const result = await pool.query(
            'INSERT INTO articles (title, description, price, category, condition, seller) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
            [title, description, price, category, articleCondition, seller]
        );
        res.status(201).json({ message: 'Article ajouté', article: result.rows[0] });
    } catch (err) {
        console.error('[ERROR]', err);
        res.status(500).json({ error: 'Erreur serveur lors de l\'ajout' });
    }
});

module.exports = router;
