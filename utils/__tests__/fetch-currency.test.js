import request from 'superagent'
import moment from 'moment'
import fetchCurrency, {
  getPrice,
  getPriceHistorical,
  fetchSymbols,
  fetchCurrencyHistorical,
  sanatizeTicker
} from '../fetch-currency'
import cheerio from 'cheerio'

describe('Fetch currency list', () => {
  it('should return list of crypto currencies', async () => {
    const response = await fetchSymbols(request)
    expect(response.status).toBe(200)
  })

  it('should reject with error')
})

describe('fetch single currency', () => {
  it('should return the html from CMC', async () => {
    const html = await fetchCurrency('bitcoin', request)
    expect(html).toContain('<h1 class="details-panel-name">')
    expect(html).toContain('Bitcoin')
    expect(html).toContain('</html>')
  })

  it('should return VEN from CMC', async () => {
    const html = await fetchCurrency('Vechain', request)
    expect(html).toContain('<h1 class="details-panel-name">')
    expect(html).toContain('VeChain')
    expect(html).toContain('</html>')
  })

  it('should return the price', async () => {
    const html = await fetchCurrency('bitcoin', request)
    const price = getPrice(html, cheerio)
    expect(price).not.toBeNull()
    expect(isNaN(price)).toBeFalsy()
    expect(typeof price).toBe('number')
  })

  it('should reject with error')
})

describe('fetchCurrencyHistorical()', () => {
  it('should return html for historical price data', async () => {
    const html = await fetchCurrencyHistorical('Bitcoin', request, moment)
    expect(html).toContain('<div id="historical-data" class="tab-pane active">')
    expect(html).toContain('Historical data for Bitcoin')
  })
})

describe('getPriceHisorical()', () => {
  it('should return data structure', async () => {
    const html = await fetchCurrencyHistorical('Bitcoin', request, moment)
    const priceArr = getPriceHistorical(html, cheerio)
    expect(priceArr.length).toBeGreaterThan(0)
  })
})

describe('sanatizeTicker()', () => {
  it('should return sanatized ticker', () => {
    const ticker = sanatizeTicker('BTC-a')
    expect(ticker).toBe('btc-a')
  })
})
