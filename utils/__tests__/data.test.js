import { insertOrFetchCoin, insertPrice } from '../data'
import winston from 'winston'
import knex from '../../db'

beforeEach(async () => {
  try {
    await knex.migrate.rollback()
    await knex.migrate.latest()
    await knex.seed.run()
  } catch (err) {
    winston.error(err)
  }
})

describe('insert coin', () => {
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
})

describe('insert price for coin', () => {
  it('should insert price', async () => {
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
