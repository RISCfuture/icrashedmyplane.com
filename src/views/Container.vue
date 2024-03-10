<template>
  <div id="container">
    <transition-group appear name="in-move-left-out-move-left" mode="out-in">
      <welcome v-if="showWelcome" />
      <question v-if="showQuestion && nextPrompt" :prompt="nextPrompt" />
      <finished v-if="showFinished" />
    </transition-group>
  </div>
</template>

<script setup lang="ts">
import Welcome from '@/views/Welcome.vue'
import Question from '@/components/Question.vue'
import Finished from '@/views/Finished.vue'
import useQuestionnaireStore from '@/stores/questionnaire'
import { storeToRefs } from 'pinia'
import { computed } from 'vue'
import { find, isNil } from 'lodash-es'
import surveyOrder from '@/data/surveyOrder'

/**
 * Root container for the application. Displays the {@link Welcome} view if no surveys have been
 * started, or the {@link Question} view if a survey is in progress, or the {@link Finished} view
 * if all surveys are complete.
 */

const store = useQuestionnaireStore()
const { clickedContinue } = storeToRefs(store)

const currentSurveyID = computed(() =>
  find(surveyOrder, (ID) => !store.response(ID)?.isEffectivelyFinished)
)

/**
 * The next question to display to the user, or `undefined` if there are no more
 * questions to ask, or the user hasn't started a survey yet.
 */
const nextPrompt = computed(() => {
  if (!clickedContinue.value) return undefined
  if (isNil(currentSurveyID.value)) return undefined
  const prompt = store.response(currentSurveyID.value)?.nextQuestion
  if (isNil(prompt)) return undefined
  return prompt
})

/** Whether to show the {@link Finished} view. */
const showFinished = computed(() => clickedContinue.value && isNil(currentSurveyID.value))

/** Whether to show the {@link Question} view. */
const showQuestion = computed(() => clickedContinue.value && !isNil(currentSurveyID.value))

/** Whether to show the {@link Welcome} view. */
const showWelcome = computed(() => !clickedContinue.value)
</script>

<style lang="scss">
@use '@/assets/styles/responsive';

#container {
  @include responsive.fill-height;

  flex: 0 0 auto;
  width: 90vw;
  max-width: 800px;

  @include responsive.large {
    min-height: 90vh;
    margin-top: 10vh;
  }

  @include responsive.small {
    min-height: 100vh;
  }

  // override the "move in" transition for the welcome page and have it fade in instead

  #welcome {
    &.in-move-left-out-move-left-enter-active {
      transition-duration: 0.5s;
      transition-property: opacity;
    }

    &.in-move-left-out-move-left-enter {
      opacity: 0;
    }

    &.in-move-left-out-move-left-enter-to {
      opacity: 1;
    }
  }
}
</style>
