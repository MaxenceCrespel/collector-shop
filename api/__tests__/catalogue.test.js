const request = require('supertest');
const app = require('../server');

jest.mock('pg', () => {
  const mPool = {
    query: jest.fn().mockResolvedValue({
      rows: [
        { id: 1, title: 'Jordan Mock', price: 100, category: 'Baskets' }
      ]
    }),
    end: jest.fn()
  };
  return { Pool: jest.fn(() => mPool) };
});

describe('GET /articles', () => {
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