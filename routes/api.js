import express from 'express'
import History from '../db/history'
import { raw } from 'objection'

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
    const obj = await History.query()
      .whereRaw(`UPPER(ticker) = ?`, [req.query.symbol.toUpperCase()])
      .orderBy(
        raw(`abs(extract(epoch FROM (created_at - timestamp ??)))`, timestamp)
      )
      .limit(1)

    const response = obj[0]
    delete response.id
    delete response.createdAt
    delete response.updatedAt

    res.json(response)
  } catch (err) {
    res.status(400).send({ error: err.message })
  }
})

export default router
