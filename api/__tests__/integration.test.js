const request = require('supertest');
const app = require('../server');

describe("Tests d''Intégration - Serveur Statique", () => {
    it('devrait servir le fichier index.html sur la racine /', async () => {
        const res = await request(app).get('/');
        expect(res.statusCode).toEqual(200);
        expect(res.headers['content-type']).stringContaining('text/html');
    });
});