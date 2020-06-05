<template>
  <transition name="in-move-left-out-move-left" mode="out-in">
    <div class="question-multi" :key="transitionKey">
      <div class="question-content">
        <p>{{title}}</p>
        <p class="check-all">{{$t('question.checkAll')}}</p>

        <div class="question-options">
          <option-category v-for="(options, category) in optionsByCategory"
                           :category="category"
                           :options="options"
                           :selections="selections"
                           :surveyId="surveyID"
                           :key="category"
                           @toggle="toggle" />
          <option-category :options="uncategorizedOptions"
                           :selections="selections"
                           :surveyId="surveyID"
                           @toggle="toggle" />
        </div>

        <slot />
      </div>
      <div class="question-actions">
        <button @click="answerChosen()" data-cy="nextButton">{{nextButtonTitle}}</button>
      </div>
    </div>
  </transition>
</template>

<script lang="ts">
  import Component from 'vue-class-component'
  import {
    every, groupBy, isEmpty, isUndefined
  } from 'lodash-es'
  import { Getter } from 'vuex-class'
  import { TranslateResult } from 'vue-i18n'
  import MultiOption from '@/components/Question/multi/MultiOption.vue'
  import AbstractQuestion from '@/components/Question/AbstractQuestion'
  import ErrorBus from '@/bus/ErrorBus'
  import { Flag, Option } from '@/models/survey'
  import OptionCategory from '@/components/Question/multi/OptionCategory.vue'

  /**
   * Displays a {@link Question} as a multiple-choice group of options. Options can be shown grouped
   * into categories, or shown as uncategorized.
   */

  @Component({
    components: { OptionCategory, MultiOption }
  })
  export default class MultiQuestion extends AbstractQuestion {
    @Getter userFlags!: Set<Flag>

    /**
     * Stores the choices the user has made as an array of booleans, indexed by the {@link Option}'s
     * position in the {@link Question.options} array.
     */

    choices: boolean[] = []

    /**
     * Resets the {@link .choices} array when a new question is shown.
     */

    protected promptChanged(): void {
      this.choices = []
    }

    /**
     * @return A list of options that do not belong to a category.
     */

    get uncategorizedOptions(): Option[] {
      return this.filteredOptions.filter(option => isUndefined(option.data.category))
    }

    /**
     * @return A dictionary mapping category identifiers to an array of options for that category.
     */

    get optionsByCategory(): { [key: string]: Option[] } {
      return groupBy(
        this.filteredOptions.filter(option => !isUndefined(option.data.category)),
        option => option.data.category
      )
    }

    private get filteredOptions(): Option[] {
      return this.question.options.filter(option =>
        every(option.only, flag => this.userFlags.has(flag)))
    }

    /**
     * @return A set of option identifiers representing the selected options.
     */

    get selections(): Set<string> {
      return this.question.options.reduce(
        (set, option, index) =>
          (this.choices[index] ? new Set([...set, option.identifier]) : set),
        new Set<string>()
      )
    }

    /**
     * @return The title of the "next" button. Says "None of the above" until the user makes a
     * selection, to help them understand they can continue with nothing selected.
     */

    get nextButtonTitle(): TranslateResult {
      return isEmpty(this.selections) ? this.$t('question.noneApplyButton') : this.$t('question.nextButton')
    }

    /**
     * Called when the user selects an option. Adds to the {@link .choices} array.
     *
     * @param identifier The identifier of the {@link Option}.
     */

    toggle(identifier: string): void {
      const index = this.question.options.findIndex(o => o.identifier === identifier)
      this.$set(this.choices, index, !this.choices[index])
    }

    /**
     * Called when the "Next" button is clicked. Records the answer to the store. Emits an error to
     * the {@link ErrorBus} if that fails.
     */

    async answerChosen(): Promise<void> {
      console.log(this.prompt, this.choices)
      try {
        await this.recordAnswer({
          surveyID: this.surveyID,
          answerPath: this.prompt.answerPath,
          choices: this.choices
        })
      } catch (e) {
        ErrorBus.$emit('error', e)
      }
    }
  }
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
  @use 'src/assets/styles/colors';
  @use 'src/assets/styles/fonts';
  @use 'src/assets/styles/responsive';

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
    @include fonts.Quicksand-Bold;
    @include responsive.font-size-regular;

    @include responsive.top-margin-large;
    @include responsive.bottom-margin-large;
    padding-left: 3em;
    padding-right: 3em;

    @include colors.theme using($theme) {
      background-color: colors.get($theme, 'button-background-color');
      color: colors.get($theme, 'button-text-color');
    }
  }
</style>
