<template>
  <error v-class="error" v-if="error" />

  <div v-else class="question">
    <i18n tag="p"
          v-if="selectedOptionTitle"
          path="question.breadcrumbs"
          class="question-breadcrumbs">
      <template #selection>
        <strong>{{selectedOptionTitle}}</strong>
      </template>
    </i18n>

    <transition name="in-fade-out-fade" mode="out-in">
      <div v-if="prompt.question.multi" class="question-type-transition" key="multi">
        <multi-question :prompt="prompt">
          <p class="notes" v-for="(body, ID) in notes" :key="ID">{{body}}</p>
          <p class="regulation" v-if="regulation">
            {{$t('question.regulation', {part: regulation})}}
          </p>
        </multi-question>
      </div>
      <div v-if="!prompt.question.multi" class="question-type-transition" key="single">
        <single-question :prompt="prompt">
          <p class="notes" v-for="(body, ID) in notes" :key="ID">{{body}}</p>
          <p class="regulation" v-if="regulation">
            {{$t('question.regulation', {part: regulation})}}
          </p>
        </single-question>
      </div>
    </transition>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue'
  import Component from 'vue-class-component'
  import { Prop } from 'vue-property-decorator'
  import { TranslateResult } from 'vue-i18n'
  import {
    assign, findLast, isArray, isUndefined
  } from 'lodash-es'
  import Prompt from '../../models/response/prompt'
  import SingleQuestion from './single/SingleQuestion.vue'
  import MultiQuestion from './multi/MultiQuestion.vue'
  import Error from '@/views/Error.vue'
  import ErrorBus from '@/bus/ErrorBus'
  import * as Survey from 'i-just-crashed-my-plane-survey'

  /**
   * Container view that displays either a {@link SingleQuestion} or a {@link MultiQuestion}
   * depending on whether the {@link Survey.Question} is single- or multiple-choice.
   */

  @Component({
    components: { Error, MultiQuestion, SingleQuestion }
  })
  export default class Question extends Vue {
    /** The Prompt object containing data about the {@link Survey.Question} and its answer. */
    @Prop({ type: Object, required: true }) prompt!: Prompt

    /** Set to true if an error is thrown; displays the {@link Error} view. */
    error = false

    mounted(): void {
      ErrorBus.$on('error', () => {
        this.error = true
      })
    }

    /** @return The identifier of the {@link Survey} this Question belongs to. */
    get surveyID(): string {
      return this.prompt.surveyID
    }

    /** @return An array of localized notes to display alongside the question. */
    get notes(): TranslateResult[] {
      const { notes } = this.prompt.question.data
      if (isArray(notes)) {
        return notes.reduce((obj, note) =>
          assign(obj, { note: this.$t(`survey.${this.surveyID}.notes.${note}`) }), {})
      }
      return []
    }

    /** @return The regulation under 49 CFR to display alongside the question. */
    get regulation(): string | undefined {
      return isUndefined(this.prompt.question.data.regulation)
        ? undefined
        : <string> this.prompt.question.data.regulation
    }

    /**
     * @return The localized text for the {@link Option} that the user chose that led to this
     * question being asked, or `null` if this is a root-level question.
     */

    get selectedOptionTitle(): TranslateResult | null {
      const option = <Survey.Option | undefined>findLast(this.prompt.questionPath, (node, index) =>
        (node instanceof Survey.Option)
        && (<Survey.Question> this.prompt.questionPath[index - 1]).multi)
      if (isUndefined(option)) return null

      return this.$t(`survey.${this.prompt.surveyID}.options.${option.identifier}`)
    }
  }
</script>

<style lang="scss">
  @use 'src/assets/styles/colors';
  @use 'src/assets/styles/fonts';
  @use 'src/assets/styles/responsive';

  .question {
    .question-breadcrumbs {
      @include responsive.font-size-small;
      @include colors.theme using ($theme) {
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
      @include colors.theme using ($theme) {
        color: colors.get($theme, 'muted-color');
      }
    }
  }
</style>
