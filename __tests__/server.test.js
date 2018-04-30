import symbols from '../utils/symbols'
import fetchCurrency from '../utils/fetch-currency'
import bitcoinRes from '../__mockData__/bitcoin.mockdata'

describe('Cryptocurrency utilities', () => {
  test('.symbols() should return an array of all currencies', () => {
    expect(symbols.length).toBeGreaterThan(0)
  })
})

describe('CoinMarketCap API Data', () => {})

describe('HTML parsing', () => {
  test('Should return price in USD', () => {})
})
