import request from 'superagent'
import cheerio from 'cheerio'
import fetchCurrency, { getPrice, fetchSymbols } from './utils/fetch-currency'
import winston from 'winston'
import './db'
import Price from './db/models/price'

async function requestData () {
  winston.info('Starting')

  const symbols = await fetchSymbols(request)

  for (const coin of symbols.body.data) {
    try {
      const html = await fetchCurrency(coin.website_slug, request)
      const priceRes = getPrice(html, cheerio)

      let sanatizedPrice
      if (isNaN(priceRes) === false) {
        sanatizedPrice = priceRes
      } else {
        sanatizedPrice = null
      }

      const price = await Price.query().insert({
        name: coin.name,
        ticker: coin.symbol,
        usdPrice: sanatizedPrice,
        timestamp: new Date().toISOString()
      })

      winston.info('Inserted', {
        symbol: price.ticker,
        sanatizedPrice: price.usdPrice
      })
    } catch (err) {
      winston.error('Error', {
        message: err.message,
        currency: coin.symbol
      })
    }
  }

  winston.info('Finished')
}

requestData()
