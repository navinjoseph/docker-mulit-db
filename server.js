import cryptocurrencies from 'cryptocurrencies'
import symbols from './utils/symbols'
import fetchCurrency from './utils/fetch-currency'
import cheerio from 'cheerio'
import log from 'roarr'

async function requestData () {
  for (const symbol of symbols) {
    const cryptoString = cryptocurrencies[symbol]
    try {
      const html = await fetchCurrency(cryptoString.replace(/\s/g, '-'))
      const $ = cheerio.load(html)
      const price = $('[data-currency-price][data-usd]').text()
      const date = new Date().getTime()
      global.ROARR.prepend =      {
        symbol,
        price,
        date




        
      }












      log('Currency found')
    } catch (err) {
      log.warn(`Can't find ${symbol}`, err.response.req.path)
    }
  }
}

requestData()
