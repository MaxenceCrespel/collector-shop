const request = require('supertest');
const app = require('../server');
const jwt = require('jsonwebtoken');

jest.mock('pg', () => {
    const mPool = { query: jest.fn(), end: jest.fn() };
    return { Pool: jest.fn(() => mPool) };
});
const { Pool } = require('pg');

describe("Tests d'Intégration et de Sécurité (C2C)", () => {
    let pool;
    const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_pour_le_cube';
    const validToken = jwt.sign({ username: 'testuser' }, JWT_SECRET, { expiresIn: '1h' });
    const invalidToken = 'un_faux_token_hack_123';

    beforeEach(() => {
        pool = new Pool();
        pool.query.mockReset();
    });

    describe('Endpoints Techniques', () => {
        it('devrait retourner un statut 200 sur la route /health', async () => {
            const res = await request(app).get('/health');
            expect(res.statusCode).toEqual(200);
        });

        it('devrait exposer les métriques Prometheus sur /metrics (200)', async () => {
            const res = await request(app).get('/metrics');
            expect(res.statusCode).toEqual(200);
            expect(res.text).toContain('nodejs_version_info');
        });
    });

    describe('Middlewares et Sécurité', () => {
        it('devrait interdire (401) la création d\'une annonce sans token', async () => {
            const res = await request(app).post('/articles').send({});
            expect(res.statusCode).toEqual(401);
        });

        it('devrait interdire (403) l\'accès avec un token invalide', async () => {
            const res = await request(app)
                .post('/articles')
                .set('Authorization', `Bearer ${invalidToken}`)
                .send({});
            expect(res.statusCode).toEqual(403);
            expect(res.body.error).toMatch(/invalide ou expiré/);
        });
    });

    describe('Opérations Catalogue C2C', () => {
        it('devrait autoriser (201) la création d\'une annonce avec un token valide', async () => {
            pool.query.mockResolvedValueOnce({
                rows: [{ id: 99, title: 'Montre Vintage', price: 200, category: 'Horlogerie', condition: 'Très bon état', seller: 'testuser' }]
            });

            const res = await request(app)
                .post('/articles')
                .set('Authorization', `Bearer ${validToken}`)
                .send({ title: 'Montre Vintage', description: 'Rare', price: 200, category: 'Horlogerie', condition: 'Très bon état' });

            expect(res.statusCode).toEqual(201);
            expect(res.body.article.title).toEqual('Montre Vintage');
            expect(res.body.article.condition).toEqual('Très bon état');
        });

        it('devrait gérer proprement un crash de la DB sur POST /articles (500)', async () => {
            pool.query.mockRejectedValueOnce(new Error('Timeout DB'));

            const res = await request(app)
                .post('/articles')
                .set('Authorization', `Bearer ${validToken}`)
                .send({ title: 'Crash Test', description: 'Crash', price: 10, category: 'Divers', condition: 'Neuf' });
            expect(res.statusCode).toEqual(500);
        });
    });
});