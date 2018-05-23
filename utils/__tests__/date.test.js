import { nearestDate } from '../date'

describe('Date utils', () => {
  describe('nearestDate()', () => {
    // it('return the index with the closest date')
    it('throws when no array passed', () => {
      expect(() => nearestDate()).toThrow()
    })

    it('returns -1 when array is empty', () => {
      expect(nearestDate([])).toBe(-1)
    })

    it('rounds up', () => {
      expect(nearestDate([10, 1, 0.5, 5], 0.3)).toBe(2)
    })

    it('rounds down', () => {
      expect(nearestDate([10, 1, 0.5, 5], 0.6)).toBe(2)
    })

    it('dates - returns target', () => {
      const dates = [
        new Date('2012-12-12'),
        new Date('2024-12-12'),
        new Date('2022-12-12'),
        new Date('2016-12-12'),
        new Date('1980-12-12')
      ]
      const target = new Date('2016-12-27T12:00:00Z')
      expect(nearestDate(dates, target)).toBe(3)
    })

    it('dates - default target', () => {
      const dates = [
        new Date('2012-12-12'),
        new Date('2024-12-12'),
        new Date('2022-12-12'),
        new Date('2016-12-12'),
        new Date(),
        new Date('1980-12-12')
      ]
      expect(nearestDate(dates)).toBe(4)
    })
  })
})
