import request from 'superagent'
import cheerio from 'cheerio'
import fetchCurrency, { getPrice, fetchSymbols } from './utils/fetch-currency'
import log from 'roarr'
import './db'
import History from './db/history'

async function requestData () {
  log('Starting')

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

      global.ROARR.prepend = {
        symbol: history.symbol,
        sanatizedPrice: history.usdPrice
      }

      log('Inserted')
    } catch (err) {
      global.ROARR.prepend = {
        message: err.message,
        currency: coin.symbol
      }
      log.error('Error')
    }
  }

  log('Finished')
}

requestData()
