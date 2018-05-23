import express from 'express'
// import winston from 'winston'
import History from '../db/history'
import { nearestDate } from '../utils/date'

const router = express.Router()

router.get('/', (req, res) => {
  res.send('api')
})

router.get('/history', async (req, res) => {
  try {
    if (!req.query.symbol) {
      throw new Error('Symbol is required')
    }

    if (!req.query.timestamp) {
      throw new Error('Timestamp is required')
    }

    const timestamp = new Date(Number(req.query.timestamp))
    const dates = await History.query().where('ticker', 'BTC')
    const dateArr = dates.map(date => {
      return date.timestamp
    })

    const index = nearestDate(dateArr, timestamp)

    const obj = dates[index]
    delete obj.id
    delete obj.createdAt
    delete obj.updatedAt

    res.json(obj)
  } catch (err) {
    res.status(400).send({ error: err.message })
  }
})

export default router
