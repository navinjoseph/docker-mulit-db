import request from 'supertest'
import app from '../../app'

describe('GET /api', () => {
  it('Should return 200', async () => {
    const response = await request(app).get('/api')
    expect(response.statusCode).toBe(200)
  })
})
