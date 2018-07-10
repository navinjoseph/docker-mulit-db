import request from 'superagent'
import cheerio from 'cheerio'
import fetchCurrency, { getPrice, fetchSymbols } from './utils/fetch-currency'
import { insertOrFetchCoin, insertPrice } from './utils/data'
import winston from 'winston'
import './db'
import Raven from './raven/'

async function requestData () {
  winston.info('Starting')

  const symbols = await fetchSymbols(request)

  for (const coinData of symbols.body.data) {
    try {
      // coinData = { id: 1, name: 'Bitcoin', symbol: 'BTC', website_slug: 'bitcoin' }
      const coin = await insertOrFetchCoin({
        name: coinData.name,
        ticker: coinData.symbol
      })

      const html = await fetchCurrency(coinData.website_slug, request)
      const priceRes = getPrice(html, cheerio)

      let sanatizedPrice
      if (isNaN(priceRes) === false) {
        sanatizedPrice = priceRes
      } else {
        sanatizedPrice = null
      }

      const price = await insertPrice({
        timestamp: new Date().toISOString(),
        usdPrice: sanatizedPrice,
        ticker: coin.ticker,
        source: {
          name: 'crimson-realtime',
          description: 'Crimson historical data'
        }
      })

      winston.info('Inserted', {
        symbol: coin.ticker,
        sanatizedPrice: price.usdPrice
      })
    } catch (err) {
      winston.error('Error', {
        message: err.message,
        currency: coinData.symbol
      })
      Raven.captureException(err)
    }
  }

  winston.info('Finished')
  winston.info('env', {
    env: process.env.NODE_ENV,
    db: process.env.DATABASE_URL
  })
}

requestData()
