<template>
  <transition name="in-move-left-out-move-left" mode="out-in">
    <div :key="transitionKey" class="question-single">
      <p>{{ title }}</p>
      <slot />

      <div class="question-options">
        <single-option
          v-for="(option, index) in question.options"
          :key="option.identifier"
          :option="option"
          :survey-id="surveyID"
          :index="index"
          @clicked="answerChosen(option.identifier)"
        />
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import useQuestion from '@/components/Question/hooks/question'
import type Prompt from '@/models/response/prompt'
import SingleOption from '@/components/Question/single/SingleOption.vue'

const props = defineProps<{
  /** The Prompt object containing data about the {@link Question} and its answer. */
  prompt: Prompt
}>()

const { title, transitionKey, surveyID, question, recordAnswer } = useQuestion(props)

function answerChosen(identifier: string) {
  const index = question.value.options.findIndex((o) => o.identifier === identifier)

  const choices: boolean[] = []
  choices[index] = true
  recordAnswer(surveyID.value, props.prompt.answerPath, choices)
}
</script>

<style lang="scss">
@use '@/assets/styles/responsive';

.question-options {
  display: flex;

  @include responsive.top-margin-large;

  @include responsive.large {
    flex-flow: row wrap;
    justify-content: center;
  }

  @include responsive.small {
    flex-flow: column nowrap;
  }
}
</style>
