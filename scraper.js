import request from 'superagent'
import cheerio from 'cheerio'
import fetchCurrency, { getPrice, fetchSymbols } from './utils/fetch-currency'
import { insertOrFetchCoin, insertPrice } from './utils/data'
import logger from './utils/logger'
import './db'

// Imports the Google Cloud client library
const monitoring = require('@google-cloud/monitoring');
const client = new monitoring.MetricServiceClient();
const projectId = process.env.GOOGLE_PROJECT;

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
    } catch (err) {
      logger.error(err, { extra: { currency: coinData.symbol } })
    }
  }

  logger.info('Finished')

  var dataPoint = {
    interval: {
      endTime: {
        seconds: Date.now() / 1000,
      },
    },
    value: {
      boolValue: true,
    },
  };
  
  var timeSeriesData = {
    metric: {
      type: 'custom.googleapis.com/pricing/scrape_job_succeeded',
      labels: {},
    },
    resource: {
      type: 'global',
      labels: {},
    },
    points: [dataPoint],
  };
  
  var monitoringRequest = {
    name: client.projectPath(projectId),
    timeSeries: [timeSeriesData],
  };
  
  client
    .createTimeSeries(monitoringRequest)
    .then(results => {
      console.log(`Done writing job success monitoring`, results[0]);
    })
    .catch(err => {
      console.error('ERROR:', err);
    });  

  process.exit()
}

requestData()
