import request from 'superagent'
import fetchCurrency, { getPrice, fetchSymbols } from '../fetch-currency'
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
    expect(html).toContain('<h1 class="text-large">')
    expect(html).toContain('Bitcoin')
    expect(html).toContain('</html>')
  })

  it('should return VEN from CMC', async () => {
    const html = await fetchCurrency('Vechain', request)
    expect(html).toContain('<h1 class="text-large">')
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
