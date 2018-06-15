import { sanatizeCurrency } from '../convert'

describe('sanatizeCurrency()', () => {
  it('should return false if not found', () => {
    expect(sanatizeCurrency('BTC')).toBe('BTC')
  })

  it('should return renamed currency if found', () => {
    expect(sanatizeCurrency('IOT')).toBe('MIOTA')
  })
})
