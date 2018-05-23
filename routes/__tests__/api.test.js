import request from 'supertest'
import app from '../../app'
import winston from 'winston'
import knex from '../../db'

beforeEach(async () => {
  try {
    await knex.migrate.rollback()
    await knex.migrate.latest()
    await knex.seed.run()
  } catch (err) {
    winston.error(err)
  }
})

describe('GET /api', () => {
  it('Should return 200', async () => {
    const response = await request(app).get('/api')
    expect(response.statusCode).toBe(200)
  })
})

describe('GET /api/history', () => {
  it('Should return 200', async () => {
    const response = await request(app).get(
      '/api/history?symbol=BTC&timestamp=1527034971544'
    )
    expect(response.statusCode).toBe(200)
  })

  it('Should return 400 if no timestamp', async () => {
    const response = await request(app).get('/api/history?symbol=BTC')
    expect(response.statusCode).toBe(400)
  })

  it('Should return 400 if no symbol', async () => {
    const response = await request(app).get('/api/history')
    expect(response.statusCode).toBe(400)
  })
})
