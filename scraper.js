import request from 'superagent'
import cheerio from 'cheerio'
import fetchCurrency, { getPrice, fetchSymbols } from './utils/fetch-currency'
import { insertOrFetchCoin, insertPrice } from './utils/data'
import logger from './utils/logger'
import './db'

async function requestData () {
  logger.info('Starting')

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

      await insertPrice({
        timestamp: new Date().toISOString(),
        usdPrice: sanatizedPrice,
        ticker: coin.ticker,
        source: {
          name: 'crimson-realtime',
          description: 'Crimson historical data'
        }
      })

      logger.info('inserted', {
        extra: {
          usdPrice: sanatizedPrice,
          ticker: coin.ticker
        }
      })
    } catch (err) {
      logger.error(err, { extra: { currency: coinData.symbol } })
    }
  }

  logger.info('Finished')

  request.get('https://cronhub.io/ping/be556310-ac1c-11e8-9ab0-e74124470935')

  process.exit()
}

requestData()
