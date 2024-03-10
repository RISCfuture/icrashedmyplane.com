import Cldr from 'cldrjs'
import likelySubtags from 'cldr-data/supplemental/likelySubtags.json'
import listsEn from 'cldr-data/main/en/listPatterns.json'
import { initial, last } from 'lodash-es'
import { useI18n } from 'vue-i18n'

interface CLDRStringPattern {
  start: string
  middle: string
  end: string

  [count: string]: string
}

export default function useCLDR() {
  const { locale } = useI18n()

  Cldr.load(likelySubtags, listsEn)
  const CLDR = new Cldr(locale.value)
  const fallbackCLDR = new Cldr('en')

  const listConstantLength = function (template: string, items: string[]): string {
    let output = template
    items.forEach((item, index) => {
      output = output.replace(`{${index}}`, item)
    })
    return output
  }

  const listMiddle = function (items: string[], template: string): string {
    if (items.length === 1) return items[0]
    return template.replace('{0}', items[0]).replace('{1}', listMiddle(items.slice(1), template))
  }

  const listStartAndMiddle = function (
    items: string[],
    startTemplate: string,
    middleTemplate: string
  ): string {
    return startTemplate
      .replace('{0}', items[0])
      .replace('{1}', listMiddle(items.slice(1), middleTemplate))
  }

  const list = function (items: string[], type = 'standard'): string {
    if (items.length === 0) return ''
    if (items.length === 1) return items[0]

    let pattern: CLDRStringPattern
    try {
      pattern =
        CLDR.main(`listPatterns/listPattern-type-${type}`) ??
        CLDR.main('listPatterns/listPattern-type-standard')
    } catch {
      pattern =
        fallbackCLDR.main(`listPatterns/listPattern-type-${type}`) ??
        fallbackCLDR.main('listPatterns/listPattern-type-standard')
    }

    if (pattern[items.length.toString()]) {
      return listConstantLength(pattern[items.length.toString()], items)
    }

    const firstAndMiddle = listStartAndMiddle(initial(items), pattern.start, pattern.middle)
    return pattern.end.replace('{0}', firstAndMiddle).replace('{1}', last(items)!)
  }

  return { CLDR, list }
}
