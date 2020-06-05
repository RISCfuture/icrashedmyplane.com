import Vue from 'vue'
import Component from 'vue-class-component'
import { Prop } from 'vue-property-decorator'
import { TranslateResult } from 'vue-i18n'
import * as Survey from 'i-just-crashed-my-plane-survey'

/**
 * @abstract
 *
 * Abstract superclass for displaying {@link Option}s.
 */

@Component
export default class AbstractOption extends Vue {
  /** The identifier of the {@link Survey} the option is part of. */
  @Prop({ type: String, required: true }) surveyId!: string

  /** The option to display. */
  @Prop({ type: Object, required: true }) option!: Survey.Option

  /** @return The localized text of the option. */

  get title(): TranslateResult {
    return this.$t(`survey.${this.surveyId}.options.${this.option.identifier}`)
  }

  /** Called when the option is clicked. Emits a `clicked` event. */

  clicked(): void {
    this.$emit('clicked')
  }
}
