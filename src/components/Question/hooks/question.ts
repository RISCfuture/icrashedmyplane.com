import { useI18n } from 'vue-i18n'
import type Prompt from '@/models/response/prompt'
import { computed } from 'vue'
import useQuestionnaireStore from '@/stores/questionnaire'

/**
 * Hook for displaying {@link Question}s.
 */
export default function useQuestion(props: { prompt: Prompt }) {
  const { t } = useI18n()

  const { recordAnswer } = useQuestionnaireStore()

  /** The question being asked. */
  const question = computed(() => props.prompt.question)
  /** The identifier of the {@link Survey} this Question belongs to. */
  const surveyID = computed(() => props.prompt.surveyID)
  /** The localized text of the question. */
  const title = computed(() => t(`survey.${surveyID.value}.questions.${question.value.identifier}`))

  /**
   * A globally unique key for this question that can be used to animate between
   * questions.
   */
  const transitionKey = computed(() => `${surveyID.value}.${question.value.identifier}`)

  return { props, question, surveyID, title, transitionKey, recordAnswer }
}
