const request = require('supertest');
const app = require('../server');
const jwt = require('jsonwebtoken');

jest.mock('pg', () => {
    const mPool = {
        query: jest.fn().mockResolvedValue({
            rows: [{ id: 99, title: 'Objet Test', price: 50, category: 'Divers', seller: 'testuser' }]
        }),
        end: jest.fn()
    };
    return { Pool: jest.fn(() => mPool) };
});

describe("Tests d'Intégration et de Sécurité (C2C)", () => {
    const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_pour_le_cube';
    const validToken = jwt.sign({ username: 'testuser' }, JWT_SECRET, { expiresIn: '1h' });

    it('devrait retourner un statut 200 sur la route /health', async () => {
        const res = await request(app).get('/health');
        expect(res.statusCode).toEqual(200);
        expect(res.text).toEqual('OK');
    });

    it('devrait interdire (401) la création d\'une annonce sans token', async () => {
        const res = await request(app).post('/articles').send({
            title: 'Hack', description: 'Tentative', price: 0, category: 'Hack'
        });
        expect(res.statusCode).toEqual(401);
        expect(res.body.error).toMatch(/Non autorisé/);
    });

    it('devrait autoriser (201) la création d\'une annonce avec un token valide', async () => {
        const res = await request(app)
            .post('/articles')
            .set('Authorization', `Bearer ${validToken}`)
            .send({ title: 'Montre Vintage', description: 'Rare', price: 200, category: 'Horlogerie' });

        expect(res.statusCode).toEqual(201);
        expect(res.body.message).toEqual('Article ajouté');
    });

    it('devrait retourner uniquement les articles du vendeur connecté sur /my-articles', async () => {
        const res = await request(app)
            .get('/my-articles')
            .set('Authorization', `Bearer ${validToken}`);

        expect(res.statusCode).toEqual(200);
        expect(Array.isArray(res.body)).toBeTruthy();
        expect(res.body[0].seller).toEqual('testuser');
    });
});
