const request = require('supertest');
const app = require('../server');
const bcrypt = require('bcrypt');

jest.mock('pg', () => {
    const mPool = { query: jest.fn(), end: jest.fn() };
    return { Pool: jest.fn(() => mPool) };
});

const { Pool } = require('pg');

describe('Routes d\'Authentification (/register & /login)', () => {
    let pool;

    beforeEach(() => {
        pool = new Pool();
        pool.query.mockReset();
    });

    describe('POST /register', () => {
        it('devrait rejeter si données manquantes (400)', async () => {
            const res = await request(app).post('/register').send({});
            expect(res.statusCode).toEqual(400);
        });

        it('devrait rejeter un pseudo trop court (400)', async () => {
            const res = await request(app).post('/register').send({ username: 'ab', password: 'password123' });
            expect(res.statusCode).toEqual(400);
        });

        it('devrait rejeter un mot de passe trop court (400)', async () => {
            const res = await request(app).post('/register').send({ username: 'user1', password: '123' });
            expect(res.statusCode).toEqual(400);
        });

        it('devrait rejeter un utilisateur existant (409)', async () => {
            pool.query.mockResolvedValueOnce({ rows: [{ id: 1 }] });
            const res = await request(app).post('/register').send({ username: 'taken_user', password: 'password123' });
            expect(res.statusCode).toEqual(409);
        });

        it('devrait inscrire un utilisateur et renvoyer un token (201)', async () => {
            pool.query.mockResolvedValueOnce({ rows: [] });
            pool.query.mockResolvedValueOnce({ rows: [{ id: 2 }] });
            const res = await request(app).post('/register').send({ username: 'new_user', password: 'password123' });
            expect(res.statusCode).toEqual(201);
            expect(res.body.token).toBeDefined();
        });

        it('devrait gérer les erreurs serveur (500)', async () => {
            pool.query.mockRejectedValueOnce(new Error('Erreur DB critique'));
            const res = await request(app).post('/register').send({ username: 'user', password: 'password123' });
            expect(res.statusCode).toEqual(500);
        });
    });

    describe('POST /login', () => {
        it('devrait rejeter si données manquantes (400)', async () => {
            const res = await request(app).post('/login').send({ username: 'only_user' });
            expect(res.statusCode).toEqual(400);
        });

        it('devrait rejeter un utilisateur introuvable (401)', async () => {
            pool.query.mockResolvedValueOnce({ rows: [] });
            const res = await request(app).post('/login').send({ username: 'ghost', password: 'password123' });
            expect(res.statusCode).toEqual(401);
        });

        it('devrait rejeter un mauvais mot de passe (401)', async () => {
            const hash = await bcrypt.hash('bon_mot_de_passe', 10);
            pool.query.mockResolvedValueOnce({ rows: [{ username: 'real_user', password_hash: hash }] });
            const res = await request(app).post('/login').send({ username: 'real_user', password: 'mauvais_mot_de_passe' });
            expect(res.statusCode).toEqual(401);
        });

        it('devrait connecter un utilisateur valide (200)', async () => {
            const hash = await bcrypt.hash('collector2026', 10);
            pool.query.mockResolvedValueOnce({ rows: [{ username: 'admin', password_hash: hash }] });
            const res = await request(app).post('/login').send({ username: 'admin', password: 'collector2026' });
            expect(res.statusCode).toEqual(200);
            expect(res.body.token).toBeDefined();
        });
    });
});
