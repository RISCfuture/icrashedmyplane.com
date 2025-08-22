<template>
  <transition name="in-move-left-out-move-left" mode="out-in">
    <div :key="transitionKey" class="question-multi">
      <div class="question-content">
        <p>{{ title }}</p>
        <p class="check-all">
          {{ t('question.checkAll') }}
        </p>

        <div class="question-options">
          <option-category
            v-for="(options, category) in optionsByCategory"
            :key="category"
            :category="category"
            :options="options"
            :selections="selections"
            :survey-id="surveyID"
            @toggle="toggle"
          />
          <option-category
            :options="uncategorizedOptions"
            :selections="selections"
            :survey-id="surveyID"
            :category="null"
            @toggle="toggle"
          />
        </div>

        <slot />
      </div>
      <div class="question-actions">
        <button type="button" @click="answerChosen()">
          {{ nextButtonTitle }}
        </button>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import OptionCategory from '@/components/Question/multi/OptionCategory.vue'
import useQuestionnaireStore from '@/stores/questionnaire'
import { storeToRefs } from 'pinia'
import { computed, ref, watch } from 'vue'
import useQuestion from '@/components/Question/hooks/question'
import { every, groupBy, isEmpty, isNil, isUndefined } from 'lodash-es'
import { useI18n } from 'vue-i18n'
import type { Option } from '@/models/survey'
import type Prompt from '@/models/response/prompt'

/**
 * Displays a {@link Question} as a multiple-choice group of options. Options can be shown grouped
 * into categories, or shown as uncategorized.
 */

const props = defineProps<{
  /** The Prompt object containing data about the {@link Question} and its answer. */
  prompt: Prompt
}>()

const { t } = useI18n()

const store = useQuestionnaireStore()
const { userFlags } = storeToRefs(store)

const { question, recordAnswer, surveyID, title, transitionKey } = useQuestion(props)

/**
 * Stores the choices the user has made as an array of booleans, indexed by the {@link Option}'s
 * position in the {@link Question.options} array.
 */
const choices = ref<boolean[]>([])

const filteredOptions = computed(() =>
  question.value.options.filter((option) => every(option.only, (flag) => userFlags.value.has(flag)))
)

/**
 * @return A list of options that do not belong to a category.
 */
const uncategorizedOptions = computed(() =>
  filteredOptions.value.filter((option) => isUndefined(option.data.category))
)

/**
 * A dictionary mapping category identifiers to an array of options for that category.
 */
const optionsByCategory = computed<Record<string, Option[]>>(() =>
  groupBy(
    filteredOptions.value.filter((option) => !isNil(option.data.category)),
    (option) => option.data.category!
  )
)

/**
 * @return A set of option identifiers representing the selected options.
 */
const selections = computed(() =>
  question.value.options.reduce(
    (set, option, index) => (choices.value[index] ? new Set([...set, option.identifier]) : set),
    new Set<string>()
  )
)

/**
 * @return The title of the "next" button. Says "None of the above" until the user makes a
 * selection, to help them understand they can continue with nothing selected.
 */
const nextButtonTitle = computed(() =>
  isEmpty(selections.value) ? t('question.noneApplyButton') : t('question.nextButton')
)

/**
 * Called when the user selects an option. Adds to the {@link .choices} array.
 *
 * @param identifier The identifier of the {@link Option}.
 */
function toggle(identifier: string) {
  const index = question.value.options.findIndex((option) => option.identifier === identifier)
  choices.value[index] = !choices.value[index]
}

/**
 * Called when the "Next" button is clicked. Records the answer to the store.
 */
function answerChosen() {
  recordAnswer(surveyID.value, props.prompt.answerPath, choices.value)
}

/**
 * Resets the {@link .choices} array when a new question is shown.
 */
watch(
  () => props.prompt,
  () => (choices.value = [])
)
</script>

<style lang="scss">
.question-multi {
  display: flex;
  flex-flow: column nowrap;
}

.question-content {
  flex: 1 1 auto;
}

.question-actions {
  flex: 0 0 auto;
  text-align: center;
}
</style>

<style scoped lang="scss">
@use '@/assets/styles/colors';
@use '@/assets/styles/fonts';
@use '@/assets/styles/responsive';

.question-options {
  display: flex;
  flex-flow: column;
}

.check-all {
  @include responsive.font-size-very-small;

  @include colors.theme using($theme) {
    color: colors.get($theme, 'muted-color');
  }
}

button {
  font-size: 24px;
  margin-top: 80px;
  margin-bottom: 80px;
  padding-right: 3em;
  padding-left: 3em;

  @include fonts.Quicksand-Bold;

  @include colors.theme using($theme) {
    color: colors.get($theme, 'button-text-color');
    background-color: colors.get($theme, 'button-background-color');
  }

  @include responsive.small {
    font-size: 18px;
    margin-top: 50px;
    margin-bottom: 50px;
  }
}
</style>
