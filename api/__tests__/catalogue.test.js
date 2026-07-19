const request = require('supertest');
const app = require('../server');

jest.mock('pg', () => {
  const mPool = {
    query: jest.fn(),
    end: jest.fn()
  };
  return { Pool: jest.fn(() => mPool) };
});

const { Pool } = require('pg');

describe('GET /articles', () => {
  let pool;

  beforeEach(() => {
    pool = new Pool();
    pool.query.mockReset();
  });

  afterAll(async () => {
    await pool.end();
  });

  it('devrait retourner un code 200, un tableau et le vendeur associé', async () => {
    pool.query.mockResolvedValueOnce({
      rows: [
        { id: 1, title: 'Jordan Mock', price: 100, category: 'Baskets', seller: 'sneakerhead75' }
      ]
    });

    const res = await request(app).get('/articles');

    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBeTruthy();
    expect(res.body[0].title).toEqual('Jordan Mock');
    expect(res.body[0].seller).toEqual('sneakerhead75');
  });

  it('devrait retourner un code 500 en cas de crash de la base de données', async () => {
    pool.query.mockRejectedValueOnce(new Error('Connexion à la base de données perdue'));

    const res = await request(app).get('/articles');

    expect(res.statusCode).toEqual(500);
    expect(res.body.error).toEqual('Erreur serveur');
    expect(res.body.detail).toBeUndefined();
  });
});
