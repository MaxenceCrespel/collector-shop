const bcrypt = require('bcrypt');
const pool = require('../config/db');

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

module.exports = seedDemoUsers;
