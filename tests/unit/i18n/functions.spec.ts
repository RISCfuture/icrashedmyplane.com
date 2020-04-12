import { expect } from 'chai'
import { list } from '@/i18n/functions'

describe('I18n', () => {
  describe('list', () => {
    it('renders a list of items using CLDR locale data', () => {
      expect(list(['one', 'two', 'three'])).to.eql('one, two, and three')
      expect(list(['one', 'two'])).to.eql('one and two')
    })

    it('renders supports specifying the list format', () => {
      expect(list(['one', 'two', 'three'], 'standard-narrow')).to.eql('one, two, three')
    })

    it('defaults to standard given an unknown format', () => {
      expect(list(['one', 'two', 'three'], 'bogus')).to.eql('one, two, and three')
    })

    it('returns a single item when given a single item', () => {
      expect(list(['one'])).to.eql('one')
    })
  })
})
