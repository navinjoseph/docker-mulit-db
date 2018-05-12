import cryptocurrencies from 'cryptocurrencies'
import symbols from './utils/symbols'
import fetchCurrency from './utils/fetch-currency'
import cheerio from 'cheerio'
import log from 'roarr'
import './db'
import History from './db/history'

async function requestData () {
  log('Starting')

  for (const symbol of symbols) {
    const cryptoString = cryptocurrencies[symbol]
    try {
      const html = await fetchCurrency(cryptoString.replace(/\s/g, '-'))
      const $ = cheerio.load(html)
      const priceString = $('[data-currency-price][data-usd]').text()
      const price = Number(priceString.split('\n')[1].replace(/,/g, ''))

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
        message: err.message,
        currency: symbol
      }
      log.warn(`Can't find currency`)
    }
  }

  log('Finished')
}

requestData()
