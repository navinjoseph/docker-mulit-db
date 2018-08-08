import { insertOrFetchCoin, insertPrice } from '../data'
import knex from '../../db'

beforeEach(async () => {
  try {
    await knex.migrate.rollback()
    await knex.migrate.latest()
    await knex.seed.run()
  } catch (err) {
    console.error(err)
  }
})

describe('insertOrFetchCoin()', () => {
  it('should insert coin if it does not exist', async () => {
    const coin = await insertOrFetchCoin({
      name: 'Ethereum',
      ticker: 'ETH'
    })
    expect(coin.name).toBe('Ethereum')
    expect(coin.ticker).toBe('ETH')
  })

  it('should return coin object if already exists', async () => {
    await insertOrFetchCoin({
      name: 'Ethereum',
      ticker: 'ETH'
    })

    const coin = await insertOrFetchCoin({
      name: 'Ethereum',
      ticker: 'ETH'
    })

    expect(coin.name).toBe('Ethereum')
    expect(coin.ticker).toBe('ETH')
  })

  it('should throw an error if no data', async () => {
    await expect(insertOrFetchCoin()).rejects.toThrow()
  })
})

describe('insert price for coin', () => {
  it('should insert price', async () => {
    await insertPrice({
      timestamp: new Date('2018-05-28T21:47:13.157Z').toISOString(),
      usdPrice: 1500,
      ticker: 'BTC',
      source: {
        name: 'aaa',
        description: 'Test'
      }
    })

    const price = await insertPrice({
      timestamp: new Date('2018-05-28T21:47:13.157Z').toISOString(),
      usdPrice: 1500,
      ticker: 'BTC',
      source: {
        name: 'aaa'
      }
    })
    expect(price.usdPrice).toBe(1500)
  })

  it('should insert price excluding source', async () => {
    const price = await insertPrice({
      timestamp: new Date('2018-05-28T21:47:13.157Z').toISOString(),
      usdPrice: 1500,
      ticker: 'BTC'
    })
    expect(price.usdPrice).toBe(1500)
  })

  it('should throw an error if coin cannot be found', async () => {
    await expect(
      insertPrice({
        timestamp: new Date('2018-05-28T21:47:13.157Z').toISOString(),
        usdPrice: 1500,
        ticker: 'BTCa'
      })
    ).rejects.toThrow('Cannot find the ticker: BTCa')
  })
})
