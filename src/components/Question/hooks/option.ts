import type { Option } from '@/models/survey'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

/**
 * Hook for displaying {@link Option}s.
 */
export default function useOption(
  props: { surveyId: string; option: Option },
  emit: (evt: 'clicked') => void
) {
  const { t } = useI18n()

  /** The localized text of the option. */
  const title = computed(() => t(`survey.${props.surveyId}.options.${props.option.identifier}`))

  /** Called when the option is clicked. Emits a `clicked` event. */
  const clicked = () => emit('clicked')

  return { props, title, clicked }
}
