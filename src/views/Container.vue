<template>
  <div id="container">
    <transition appear name="in-move-left-out-move-left" mode="out-in">
      <welcome v-if="showWelcome" />
      <question v-if="showQuestion" :prompt="nextPrompt" />
      <finished v-if="showFinished" />
    </transition>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue'
  import Component from 'vue-class-component'
  import { Getter } from 'vuex-class'
  import { find, isNil } from 'lodash-es'
  import Welcome from '@/views/Welcome.vue'
  import surveyOrder from '@/data/surveyOrder'
  import Response from '@/models/response'
  import Finished from '@/views/Finished.vue'
  import Prompt from '@/models/response/prompt'
  import Question from '@/components/Question/Question.vue'

  /**
   * Root container for the application. Displays the {@link Welcome} view if no surveys have been
   * started, or the {@link Question} view if a survey is in progress, or the {@link Finished} view
   * if all surveys are complete.
   */

  @Component({
    components: { Question, Finished, Welcome }
  })
  export default class Container extends Vue {
    @Getter clickedContinue!: boolean

    @Getter response!: (identifier: string) => Response

    /**
     * @return The next question to display to the user, or `undefined` if there are no more
     * questions to ask, or the user hasn't started a survey yet.
     */

    get nextPrompt(): Prompt | undefined {
      if (!this.clickedContinue) return undefined
      if (isNil(this.currentSurveyID)) return undefined
      const prompt = this.response(this.currentSurveyID)?.nextQuestion
      if (isNil(prompt)) return undefined
      return prompt
    }

    /** @return Whether to show the {@link Finished} view. */
    get showFinished(): boolean {
      return this.clickedContinue && isNil(this.currentSurveyID)
    }

    /** @return Whether to show the {@link Question} view. */
    get showQuestion(): boolean {
      return this.clickedContinue && !isNil(this.currentSurveyID)
    }

    /** @return Whether to show the {@link Welcome} view. */
    get showWelcome(): boolean {
      return !this.clickedContinue
    }

    private get currentSurveyID(): string | undefined {
      return find(surveyOrder, ID => !this.response(ID)?.isEffectivelyFinished)
    }
  }
</script>

<style lang="scss">
  @use 'src/assets/styles/responsive';

  #container {
    @include responsive.fill-height;

    flex: 0 0 auto;
    max-width: 800px;
    width: 90vw;

    @include responsive.large {
      margin-top: 10vh;
      min-height: 90vh;
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
