import express from 'express'
import Coin from '../db/models/coin'
import { raw } from 'objection'
import Raven from '../raven/'

const router = express.Router()

router.get('/', (req, res) => {
  res.send('api')
})

router.get('/history', async (req, res) => {
  try {
    if (!req.query.symbol) {
      throw new Error('Symbol is required')
    }

    let timestamp
    if (!req.query.timestamp) {
      timestamp = new Date().toISOString()
    } else {
      timestamp = new Date(Number(req.query.timestamp)).toISOString()
    }

    const coin = await Coin.query().where(raw(`UPPER(ticker) = ?`, [req.query.symbol.toUpperCase()]))

    if (coin.length === 0) {
      throw new Error(`Cannot find data for ticker: ${req.query.symbol.toUpperCase()} - ${timestamp}`)
    }

    const price = await coin[0]
      .$relatedQuery('prices')
      .orderBy(raw(`abs(extract(epoch FROM (price."timestamp" - timestamp '${timestamp}')))`))
      .limit(1)

    const response = {
      ...price[0],
      ticker: coin[0].ticker,
      name: coin[0].name
    }
    delete response.id
    delete response.createdAt
    delete response.updatedAt
    delete response.coinId
    delete response.sourceId

    res.json(response)
  } catch (err) {
    Raven.captureException(err)
    res.status(400).send({ error: err.message })
  }
})

export default router
