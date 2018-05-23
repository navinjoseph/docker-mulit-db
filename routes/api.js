import express from 'express'
// import winston from 'winston'
import History from '../db/history'

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

    const date = await History.query().where('ticker', 'BTC')
    console.log(date)

    const obj = {
      symbol: req.query.symbol,
      timestamp
    }

    res.json(obj)
  } catch (err) {
    res.status(400).send({ error: err.message })
  }
})

export default router
