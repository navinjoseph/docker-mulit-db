import express from 'express'
import Coin from '../db/models/coin'
import { raw } from 'objection'
import Raven from '../raven/'
import authenticate from '../middleware/auth'

const router = express.Router()

/*
router.get('/', (req, res) => {
  res.send('api')
})
*/

router.get('/history', authenticate, async (req, res) => {
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

    const querySymbol = req.query.symbol.toUpperCase()
    const coin = await Coin.query()
      .where(raw(`UPPER(ticker) = ?`, [querySymbol]))
      .orWhere('ticker', 'BTC')
      .orWhere('ticker', 'ETH')

    const mappedTickers = coin.map(obj => obj.ticker)
    const queryIndex = mappedTickers.indexOf(querySymbol)
    const btcIndex = mappedTickers.indexOf('BTC')
    const ethIndex = mappedTickers.indexOf('ETH')

    if (queryIndex === -1) {
      throw new Error(`Cannot find data for ticker: ${req.query.symbol.toUpperCase()} - ${timestamp}`)
    }

    const price = await coin[queryIndex]
      .$relatedQuery('prices')
      .orderBy(raw(`abs(extract(epoch FROM (price."timestamp" - timestamp '${timestamp}')))`))
      .limit(1)
    const btcPrice = await coin[btcIndex]
      .$relatedQuery('prices')
      .orderBy(raw(`abs(extract(epoch FROM (price."timestamp" - timestamp '${timestamp}')))`))
      .limit(1)
    const ethPrice = await coin[ethIndex]
      .$relatedQuery('prices')
      .orderBy(raw(`abs(extract(epoch FROM (price."timestamp" - timestamp '${timestamp}')))`))
      .limit(1)

    const response = {
      price: {
        USD: price[0].usdPrice,
        BTC: price[0].usdPrice / btcPrice[0].usdPrice,
        ETH: price[0].usdPrice / ethPrice[0].usdPrice
      },
      timestamp: price[0].timestamp,
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
