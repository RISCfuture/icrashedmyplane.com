import Cldr from 'cldrjs'
import likelySubtags from 'cldr-data/supplemental/likelySubtags.json'
import listsEn from 'cldr-data/main/en/listPatterns.json'
import { initial, last } from 'lodash-es'
import VueI18n from './index'

interface CLDRStringPattern {
  start: string;
  middle: string;
  end: string;

  [count: string]: string;
}
Cldr.load(likelySubtags, listsEn)
export const CLDR = new Cldr(VueI18n.locale)

function listConstantLength(template: string, items: string[]): string {
  let output = template
  items.forEach((item, index) => {
    output = output.replace(`{${index}}`, item)
  })
  return output
}

function listMiddle(items: string[], template: string): string {
  if (items.length === 1) return items[0]
  return template.replace('{0}', items[0]).replace('{1}', listMiddle(items.slice(1), template))
}

function listStartAndMiddle(
  items: string[],
  startTemplate: string,
  middleTemplate: string
): string {
  return startTemplate.
    replace('{0}', items[0]).
    replace('{1}', listMiddle(items.slice(1), middleTemplate))
}

export function list(items: string[], type = 'standard'): string {
  if (items.length === 1) return items[0]

  const pattern: CLDRStringPattern = CLDR.main(`listPatterns/listPattern-type-${type}`)
      || CLDR.main('listPatterns/listPattern-type-standard')

  if (pattern[items.length.toString()]) {
    return listConstantLength(pattern[items.length.toString()], items)
  }

  const firstAndMiddle = listStartAndMiddle(
    initial(items),
    pattern.start,
    pattern.middle
  )
  return pattern.end.replace('{0}', firstAndMiddle).replace('{1}', last(items)!)
}
