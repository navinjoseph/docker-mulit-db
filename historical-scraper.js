import request from 'superagent'
import cheerio from 'cheerio'
import moment from 'moment'
import { fetchSymbols, fetchCurrencyHistorical, getPriceHistorical } from './utils/fetch-currency'
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

      const html = await fetchCurrencyHistorical(coinData.website_slug, request, moment)
      const priceArr = getPriceHistorical(html, cheerio)

      for (const price of priceArr) {
        const openDate = moment(new Date(price.date))
          .add(9.5, 'hours')
          .toISOString()

        const closeDate = moment(new Date(price.date))
          .add(16, 'hours')
          .toISOString()

        const insertedOpenPrice = await insertPrice({
          ticker: coin.ticker,
          timestamp: openDate,
          usdPrice: price.open,
          source: {
            name: 'crimson-historical',
            description: 'Crimson historical data'
          }
        })

        logger.info('Success', {
          ticker: coin.ticker,
          timestamp: insertedOpenPrice.timestamp,
          usdPrice: insertedOpenPrice.usdPrice
        })

        const insertedClosePrice = await insertPrice({
          ticker: coin.ticker,
          timestamp: closeDate,
          usdPrice: price.close,
          source: {
            name: 'crimson-historical'
          }
        })

        logger.info('Success', {
          ticker: coin.ticker,
          timestamp: insertedClosePrice.timestamp,
          usdPrice: insertedClosePrice.usdPrice
        })
      }
    } catch (err) {
      logger.error(err, { extra: { currency: coinData.symbol } })
    }
  }
  logger.info('Finished')
}

requestData()
