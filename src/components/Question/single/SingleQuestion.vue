<template>
  <transition name="in-move-left-out-move-left" mode="out-in">
    <div class="question-single" :key="transitionKey">
      <p>{{title}}</p>
      <slot />

      <div class="question-options">
        <single-option v-for="(option, index) in question.options"
                       :option="option"
                       :survey-id="surveyID"
                       :key="option.identifier"
                       :index="index"
                       @clicked="answerChosen(option.identifier)" />
      </div>
    </div>
  </transition>
</template>

<script lang="ts">
  import Component from 'vue-class-component'
  import AbstractQuestion from '@/components/Question/AbstractQuestion'
  import ErrorBus from '@/bus/ErrorBus'
  import SingleOption from '@/components/Question/single/SingleOption.vue'

  /**
   * Displays a {@link Question} for which the user can only choose one {@link Option}. Clicking on
   * an option immediately advances the survey.
   */

  @Component({
    components: { SingleOption }
  })
  export default class SingleQuestion extends AbstractQuestion {
    /**
     * Called when an option is clicked. Records the answer to the store. Emits an error to
     * the {@link ErrorBus} if that fails.
     *
     * @param identifier The identifier of the {@link Option} that was chosen.
     */

    async answerChosen(identifier: string): Promise<void> {
      const index = this.question.options.findIndex(o => o.identifier === identifier)
      console.log(this.prompt, index)

      const choices: boolean[] = []
      choices[index] = true
      try {
        await this.recordAnswer({
          surveyID: this.surveyID,
          answerPath: this.prompt.answerPath,
          choices
        })
      } catch (e) {
        ErrorBus.$emit('error', e)
      }
    }
  }
</script>

<style lang="scss">
  @use "src/assets/styles/responsive";

  .question-options {
    @include responsive.top-margin-large;

    @include responsive.large {
      flex-flow: row wrap;
      justify-content: center;
    }

    @include responsive.small {
      flex-flow: column nowrap;
    }

    display: flex;
  }
</style>
