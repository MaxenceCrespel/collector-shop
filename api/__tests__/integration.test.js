const request = require('supertest');
const app = require('../server');

describe("Tests d''Intégration - Healthcheck", () => {
    it('devrait retourner un statut 200 sur la route /health', async () => {
        const res = await request(app).get('/health');
        expect(res.statusCode).toEqual(200);
        expect(res.text).toEqual('OK');
    });
});