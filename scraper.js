import request from 'superagent'
import cheerio from 'cheerio'
import fetchCurrency, { getPrice, fetchSymbols } from './utils/fetch-currency'
import { insertOrFetchCoin, insertPrice } from './utils/data'
import logger from './utils/logger'
import monitoring from '@google-cloud/monitoring'
import './db'

const client = new monitoring.MetricServiceClient()
const { GOOGLE_PROJECT } = process.env

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

  const dataPoint = {
    interval: {
      endTime: {
        seconds: Date.now() / 1000
      }
    },
    value: {
      boolValue: true
    }
  }

  const timeSeriesData = {
    metric: {
      type: 'custom.googleapis.com/pricing/scrape_job_succeeded',
      labels: {}
    },
    resource: {
      type: 'global',
      labels: {}
    },
    points: [dataPoint]
  }

  const monitoringRequest = {
    name: client.projectPath(GOOGLE_PROJECT),
    timeSeries: [timeSeriesData]
  }

  client
    .createTimeSeries(monitoringRequest)
    .then(results => {
      logger.info(`Done writing job success monitoring`, {
        extra: {
          results: results[0]
        }
      })
    })
    .catch(err => {
      logger.error(err)
    })

  process.exit()
}

requestData()
