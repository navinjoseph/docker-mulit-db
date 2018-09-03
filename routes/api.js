import express from 'express'
import Coin from '../db/models/coin'
import knex from '../db/'
import { raw } from 'objection'
import authenticate from '../middleware/auth'
import { sanatizeCurrency } from '../utils/convert'
import cache from '../middleware/cache'
import logger from '../utils/logger'

const router = express.Router()

router.get('/current', authenticate, cache(180, 'json'), async (req, res) => {
  try {
    const query = `
    SELECT
      p.timestamp, p.usd_price, p.coin_id, name, ticker
    FROM
      coin AS c,
      LATERAL (
        SELECT
          pi.*
        FROM
          price AS pi
        WHERE
          pi.coin_id = c.id
        ORDER BY
            pi. "timestamp" DESC
        LIMIT 1)
      AS p
    `

    const data = await knex.raw(query)
    res.json(data.rows)
  } catch (err) {
    logger.error(err, {
      extra: {
        info: 'Error in /current',
        message: err.message,
        stack: err.stack
      }
    })
    res.status(400).send({ error: err.message })
  }
})

router.get('/range', authenticate, async (req, res) => {
  try {
    if (!req.query.symbol) {
      throw new Error('Symbol is required')
    }

    if (!req.query.start || !req.query.end) {
      throw new Error('Start and end is required')
    }

    const querySymbol = req.query.symbol
      .toUpperCase()
      .split(',')
      .map(item => sanatizeCurrency(item))
      .filter(item => item !== 'USD')

    const start = new Date(+req.query.start)
    const end = new Date(+req.query.end)

    const coins = await Coin.query()
      .whereIn('ticker', querySymbol)
      .eager('prices')
      .modifyEager('prices', builder => {
        builder.whereBetween('timestamp', [start, end])
        builder.orderBy('timestamp', 'asc')
      })

    const response = coins.reduce((acc, val) => {
      return { [val.ticker]: val.prices, ...acc }
    }, {})

    res.json(response)
  } catch (err) {
    logger.error(err, {
      extra: {
        info: 'Error in /range',
        message: err.message,
        stack: err.stack
      }
    })
    res.status(400).send({ error: err.message })
  }
})

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
      ticker: coin[queryIndex].ticker,
      name: coin[queryIndex].name
    }

    delete response.id
    delete response.createdAt
    delete response.updatedAt
    delete response.coinId
    delete response.sourceId

    res.json(response)
  } catch (err) {
    logger.error(err, {
      extra: {
        info: 'Error in /history',
        message: err.message,
        stack: err.stack
      }
    })
    res.status(400).send({ error: err.message })
  }
})

export default router
