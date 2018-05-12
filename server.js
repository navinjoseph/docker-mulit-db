import cryptocurrencies from 'cryptocurrencies'
import request from 'superagent'
import cheerio from 'cheerio'
import symbols from './utils/symbols'
import fetchCurrency, { getPrice } from './utils/fetch-currency'
import log from 'roarr'
import './db'
import History from './db/history'

async function requestData () {
  log('Starting')

  for (const symbol of symbols) {
    const cryptoString = cryptocurrencies[symbol]
    try {
      const html = await fetchCurrency(cryptoString, request)
      const price = getPrice(html, cheerio)

      const timestamp = new Date().toISOString()

      global.ROARR.prepend = {
        symbol,
        price,
        timestamp
      }

      log('Currency found')

      await History.query().insert({
        name: cryptoString,
        ticker: symbol,
        usdPrice: price,
        timestamp
      })
    } catch (err) {
      global.ROARR.prepend = {
        error: err,
        message: err.message,
        currency: symbol
      }
      log.error('Error')
    }
  }

  log('Finished')
}

requestData()
