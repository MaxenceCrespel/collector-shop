const request = require('supertest');
const app = require('../server');

// On simule le module 'pg' pour éviter qu'il cherche une vraie base de données
jest.mock('pg', () => {
  const mPool = {
    query: jest.fn().mockResolvedValue({
      rows: [
        { id: 1, title: 'Jordan Mock', price: 100, category: 'Baskets' }
      ]
    }),
    end: jest.fn() // Simule la fermeture de la connexion
  };
  return { Pool: jest.fn(() => mPool) };
});

describe('GET /articles', () => {
  // Après tous les tests, on s'assure de fermer proprement les processus
  afterAll(async () => {
    const pg = require('pg');
    const pool = new pg.Pool();
    await pool.end();
  });

  it('devrait retourner un code 200 et un tableau', async () => {
    const res = await request(app).get('/articles');
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBeTruthy();
    expect(res.body[0].title).toEqual('Jordan Mock');
  });
});