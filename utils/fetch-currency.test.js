import request from 'superagent'
import fetchCurrency, { getPrice } from './fetch-currency'
import cheerio from 'cheerio'

describe('fetch currency utils', () => {
  it('should return the html from CMC', async () => {
    const html = await fetchCurrency('bitcoin', request)
    expect(html).toContain('<h1 class="text-large">')
    expect(html).toContain('Bitcoin')
    expect(html).toContain('</html>')
  })

  it('should return the price', async () => {
    const html = await fetchCurrency('bitcoin', request)
    const price = getPrice(html, cheerio)
    expect(price).not.toBeNull()
    expect(isNaN(price)).toBeFalsy()
    expect(typeof price).toBe('number')
  })
})
