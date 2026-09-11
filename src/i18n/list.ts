import { useI18n } from 'vue-i18n'

/**
 * Provides natural-language list formatting in the active locale.
 *
 * @return A `list` function that joins items the way the locale writes a list.
 */
export default function useListFormat() {
  const { locale } = useI18n()

  /**
   * Joins items into a conjunctive list, such as “A, B, and C”.
   *
   * @param items The items to join.
   * @return The joined list.
   */
  const list = (items: string[]): string =>
    new Intl.ListFormat(locale.value, { type: 'conjunction' }).format(items)

  return { list }
}
