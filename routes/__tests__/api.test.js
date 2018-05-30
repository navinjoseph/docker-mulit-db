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

describe('GET /api/v1', () => {
  it('Should return 200', async () => {
    const response = await request(app).get('/api/v1')
    expect(response.statusCode).toBe(200)
  })
})

describe('GET /api/v1/history', () => {
  it('Should return 200', async () => {
    const response = await request(app).get('/api/v1/history?symbol=BTC&timestamp=1527034971544')
    expect(response.statusCode).toBe(200)
    expect(response.body.ticker).toBe('BTC')
    expect(response.body.name).toBe('Bitcoin')

    const keys = Object.keys(response.body)
    expect(keys).toEqual(['timestamp', 'usdPrice', 'ticker', 'name'])
  })

  it('should return closest date', async () => {
    const response = await request(app).get('/api/v1/history?symbol=ltc&timestamp=1367141400000')
    expect(response.body.timestamp).toContain('2013-04-28')
  })

  it('should return 400 if coin cant be found', async () => {
    const response = await request(app).get('/api/v1/history?symbol=ABC&timestamp=1527034971544')
    expect(response.statusCode).toBe(400)
  })

  it('Should return 400 if no timestamp', async () => {
    const response = await request(app).get('/api/v1/history?symbol=BTC')
    expect(response.statusCode).toBe(400)
  })

  it('Should return 400 if no symbol', async () => {
    const response = await request(app).get('/api/v1/history')
    expect(response.statusCode).toBe(400)
  })
})
