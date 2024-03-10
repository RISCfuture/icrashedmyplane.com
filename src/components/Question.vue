<template>
  <div class="question">
    <i18n-t
      v-if="selectedOptionTitle"
      tag="p"
      keypath="question.breadcrumbs"
      class="question-breadcrumbs"
    >
      <template #selection>
        <strong>{{ selectedOptionTitle }}</strong>
      </template>
    </i18n-t>

    <div name="in-fade-out-fade" mode="out-in">
      <div>
        <div v-if="prompt.question.multi" key="multi" class="question-type-transition">
          <multi-question :prompt="prompt">
            <p v-for="(body, ID) in notes" :key="ID" class="notes">
              {{ body }}
            </p>
            <p v-if="regulation" class="regulation">
              {{ t('question.regulation', { part: regulation }) }}
            </p>
          </multi-question>
        </div>
        <div v-if="!prompt.question.multi" key="single" class="question-type-transition">
          <single-question :prompt="prompt">
            <p v-for="(body, ID) in notes" :key="ID" class="notes">
              {{ body }}
            </p>
            <p v-if="regulation" class="regulation">
              {{ t('question.regulation', { part: regulation }) }}
            </p>
          </single-question>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import SingleQuestion from '@/components/Question/single/SingleQuestion.vue'
import MultiQuestion from '@/components/Question/multi/MultiQuestion.vue'
import { useI18n } from 'vue-i18n'
import type Prompt from '@/models/response/prompt'
import { computed } from 'vue'
import { assign, findLast, isArray, isUndefined } from 'lodash-es'
import { isOption, type Option, type Question } from '@/models/survey'

/**
 * Container view that displays either a {@link SingleQuestion} or a {@link MultiQuestion}
 * depending on whether the {@link Question} is single- or multiple-choice.
 */

const { t } = useI18n()

const props = defineProps<{
  /** The Prompt object containing data about the {@link Question} and its answer. */
  prompt: Prompt
}>()

/** The identifier of the {@link Survey} this Question belongs to. */
const surveyID = computed(() => props.prompt.surveyID)

/** An array of localized notes to display alongside the question. */
const notes = computed(() => {
  const { notes } = props.prompt.question.data
  if (isArray(notes)) {
    return notes.reduce(
      (obj, note) => assign(obj, { note: t(`survey.${surveyID.value}.notes.${note}`) }),
      {}
    )
  }
  return []
})

/** The regulation under 49 CFR to display alongside the question. */
const regulation = computed(() =>
  isUndefined(props.prompt.question.data.regulation)
    ? undefined
    : (props.prompt.question.data.regulation as string)
)

/**
 * The localized text for the {@link Option} that the user chose that led to this
 * question being asked, or `null` if this is a root-level question.
 */
const selectedOptionTitle = computed(() => {
  const option = findLast(
    props.prompt.questionPath,
    (node, index) => isOption(node) && (props.prompt.questionPath[index - 1] as Question).multi
  ) as Option | undefined
  if (isUndefined(option)) return null

  return t(`survey.${props.prompt.surveyID}.options.${option.identifier}`)
})
</script>

<style lang="scss">
@use '@/assets/styles/colors';
@use '@/assets/styles/fonts';
@use '@/assets/styles/responsive';

.question {
  .question-breadcrumbs {
    @include responsive.font-size-small;

    @include colors.theme using($theme) {
      color: colors.get($theme, 'breadcrumbs-color');
    }

    strong {
      @include fonts.Quicksand-SemiBold;
    }
  }

  p {
    @include responsive.font-size-regular;
  }

  .notes {
    @include fonts.Quicksand-Light;
    @include responsive.font-size-small;
  }

  .regulation {
    @include fonts.Quicksand-Light;
    @include responsive.font-size-very-small;

    @include colors.theme using($theme) {
      color: colors.get($theme, 'muted-color');
    }
  }
}
</style>
