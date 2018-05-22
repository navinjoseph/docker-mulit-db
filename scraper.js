import request from 'superagent'
import cheerio from 'cheerio'
import fetchCurrency, { getPrice, fetchSymbols } from './utils/fetch-currency'
import winston from 'winston'
import './db'
import History from './db/history'

async function requestData () {
  winston.info('Starting')

  const symbols = await fetchSymbols(request)

  for (const coin of symbols.body.data) {
    try {
      const html = await fetchCurrency(coin.website_slug, request)
      const price = getPrice(html, cheerio)

      let sanatizedPrice
      if (isNaN(price) === false) {
        sanatizedPrice = price
      } else {
        sanatizedPrice = null
      }

      const history = await History.query().insert({
        name: coin.name,
        ticker: coin.symbol,
        usdPrice: sanatizedPrice,
        timestamp: new Date().toISOString()
      })

      winston.info('Inserted', {
        symbol: history.ticker,
        sanatizedPrice: history.usdPrice
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
