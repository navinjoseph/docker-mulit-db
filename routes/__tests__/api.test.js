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

/*
describe('GET /api/v1', () => {
  it('Should return 200', async () => {
    const response = await request(app).get('/api/v1')
    expect(response.statusCode).toBe(200)
  })
})
*/

describe('GET /api/v1/history', () => {
  it('should fail with no auth', async () => {
    const response = await request(app).get('/api/v1/history?symbol=BTC&timestamp=1527034971544')
    expect(response.statusCode).toBe(500)
  })

  it('should fail if token is invalid', async () => {
    const response = await request(app).get(
      '/api/v1/history?symbol=BTC&timestamp=1527034971544&access_token=7c96053'
    )
    expect(response.statusCode).toBe(500)
  })

  it('Should return 200', async () => {
    const response = await request(app).get(
      '/api/v1/history?symbol=BTC&timestamp=1527034971544&access_token=7c96053e681f16e90aaefd33566ed1fc'
    )
    expect(response.statusCode).toBe(200)
    expect(response.body.ticker).toBe('BTC')
    expect(response.body.name).toBe('Bitcoin')

    const keys = Object.keys(response.body)
    expect(keys).toEqual(['price', 'timestamp', 'ticker', 'name'])
    const price = Object.keys(response.body.price)
    expect(price).toEqual(['USD', 'BTC', 'ETH'])
  })

  it('should return same ticker as query', async () => {
    const response = await request(app).get(
      '/api/v1/history?symbol=LTC&timestamp=1527034971544&access_token=7c96053e681f16e90aaefd33566ed1fc'
    )
    expect(response.statusCode).toBe(200)
    expect(response.body.ticker).toBe('LTC')
  })

  it('should return closest date', async () => {
    const response = await request(app).get(
      '/api/v1/history?symbol=ltc&timestamp=1367141400000&access_token=7c96053e681f16e90aaefd33566ed1fc'
    )
    expect(response.body.timestamp).toContain('2013-04-28')
  })

  it('should return 400 if coin cant be found', async () => {
    const response = await request(app).get(
      '/api/v1/history?symbol=ABC&timestamp=1527034971544&access_token=7c96053e681f16e90aaefd33566ed1fc'
    )
    expect(response.statusCode).toBe(400)
  })

  it('Should return latest symbol if no timestamp', async () => {
    const response = await request(app).get(
      '/api/v1/history?symbol=BTC&access_token=7c96053e681f16e90aaefd33566ed1fc'
    )
    expect(response.statusCode).toBe(200)
  })

  it('Should return 400 if no symbol', async () => {
    const response = await request(app).get('/api/v1/history?access_token=7c96053e681f16e90aaefd33566ed1fc')
    expect(response.statusCode).toBe(400)
  })
})

describe('GET /range', () => {
  it('should return a date range for one coin', async () => {
    const response = await request(app).get(
      '/api/v1/range?symbol=ltc&start=1483228800000&end=1514764800000&access_token=7c96053e681f16e90aaefd33566ed1fc'
    )
    expect(response.body).toHaveProperty('LTC')
  })

  it('should return a date range for list of coins', async () => {
    const response = await request(app).get(
      '/api/v1/range?symbol=ltc,btc&start=1483228800000&end=1514764800000&access_token=7c96053e681f16e90aaefd33566ed1fc'
    )
    expect(response.body).toHaveProperty('LTC')
    expect(response.body).toHaveProperty('BTC')
  })

  it('should return a date range for multiple coins', async () => {
    const response = await request(app).get(
      '/api/v1/range?symbol=ltc,btc&start=1483228800000&end=1514764800000&access_token=7c96053e681f16e90aaefd33566ed1fc'
    )
    expect(response.body.BTC).toHaveLength(2)
  })

  it('should return 400 when no no start and end', async () => {
    const response = await request(app).get(
      '/api/v1/range?symbol=ltc,btc&access_token=7c96053e681f16e90aaefd33566ed1fc'
    )
    expect(response.status).toBe(400)
  })

  it('should return empty arrays when end is before start', async () => {
    const response = await request(app).get(
      '/api/v1/range?symbol=ltc,btc&end=1483228800000&start=1514764800000&access_token=7c96053e681f16e90aaefd33566ed1fc'
    )
    expect(response.body.LTC).toHaveLength(0)
    expect(response.body.BTC).toHaveLength(0)
  })
})
