import Coin from '../db/models/coin'
import Price from '../db/models/price'
import Source from '../db/models/source'

export const insertOrFetchCoin = data => {
  return new Promise(async (resolve, reject) => {
    try {
      const retrivedCoins = await Coin.query().where('ticker', data.ticker)
      if (retrivedCoins.length === 0) {
        const newCoin = await Coin.query().insert(data)
        resolve(newCoin)
      } else {
        resolve(retrivedCoins[0])
      }
    } catch (err) {
      reject(err)
    }
  })
}

export const insertPrice = data => {
  return new Promise(async (resolve, reject) => {
    try {
      const coin = await Coin.query().where('ticker', data.ticker)

      if (coin.length === 0) {
        throw new Error(`Cannot find the ticker: ${data.ticker}`)
      }

      const price = await coin[0].$relatedQuery('prices').insert({
        timestamp: data.timestamp,
        usdPrice: data.usdPrice
      })

      let source = null
      const sourceQuery = await Source.query().where('name', data.source.name)

      if (sourceQuery.length === 0) {
        source = data.source
      } else {
        source = sourceQuery
      }

      await Price.query().upsertGraph(
        {
          id: price.id,
          source
        },
        {
          insertMissing: true,
          update: true,
          relate: true
        }
      )

      resolve(price)
    } catch (err) {
      reject(err)
    }
  })
}
