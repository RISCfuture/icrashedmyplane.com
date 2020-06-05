import Vue from 'vue'
import Component from 'vue-class-component'
import { Prop, Watch } from 'vue-property-decorator'
import { Action } from 'vuex-class'
import { TranslateResult } from 'vue-i18n'
import Prompt from '@/models/response/prompt'
import { Question } from 'i-just-crashed-my-plane-survey'

/**
 * @abstract
 *
 * Abstract superclass for displaying {@link Question}s.
 */

@Component
export default class AbstractQuestion extends Vue {
  /** The Prompt object containing data about the {@link Question} and its answer. */
  @Prop({ type: Object, required: true }) prompt!: Prompt

  @Action recordAnswer!: (
    { answerPath, choices }: {
      surveyID: string;
      answerPath: number[];
      choices: boolean[];
    }
  ) => Promise<void>

  /** @return The question being asked. */
  get question(): Question {
    return this.prompt.question
  }

  /** @return The identifier of the {@link Survey} this Question belongs to. */
  get surveyID(): string {
    return this.prompt.surveyID
  }

  /** @return The localized text of the question. */
  get title(): TranslateResult {
    return this.$t(`survey.${this.surveyID}.questions.${this.question.identifier}`)
  }

  /**
   * @return A globally unique key for this question that can be used to animate between
   * questions.
   */

  get transitionKey(): string {
    return `${this.prompt.surveyID}.${this.prompt.question.identifier}`
  }

  @Watch('prompt')
  // eslint-disable-next-line class-methods-use-this,@typescript-eslint/no-empty-function
  protected promptChanged(): void {}
}
