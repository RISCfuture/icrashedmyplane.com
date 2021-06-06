<template>
  <div class="option-category"
       :class="{'option-category-uncategorized': !category, 'even-option-count': isEven}">
    <h1>{{title || 'uncategorized'}}</h1>

    <div class="option-category-options">
      <div class="multi-option-container" v-for="option in options" :key="option.identifier">
        <multi-option :option="option"
                      :selected="isSelected(option)"
                      :survey-id="surveyId"
                      @clicked="toggle(option)" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue'
  import Component from 'vue-class-component'
  import { Prop } from 'vue-property-decorator'
  import { TranslateResult } from 'vue-i18n'
  import { isNil } from 'lodash-es'
  import MultiOption from './MultiOption.vue'
  import { Option } from '@/models/survey'

  /**
   * A category of {@link Option}s to display as part of a {@link MultiQuestion}. Categories can
   * either be named (in which case they are shown under a title), or be untitled, in which case
   * they will appear as "top-level" options (effectively no category).
   *
   * The source of truth for whether an option is selected is {@link MultiQuestion.choices}.
   */

  @Component({
    components: { MultiOption }
  })
  export default class OptionCategory extends Vue {
    /** The identifier of the {@link Survey} the question belongs to. */
    @Prop({ type: String, required: true }) surveyId!: string

    /** The identifier of the category, or `null` if these are top-level options. */
    @Prop({ type: String, required: false }) category!: string | null

    /** The list * of options to display. */
    @Prop({ type: Array, required: true }) options!: Option[]

    /** The identifiers of the options that the user has selected. */
    @Prop({ type: Set, required: true }) selections!: Set<string>

    /** @return The localized title for the category, or `null` for top-level options. */
    get title(): TranslateResult | null {
      if (isNil(this.category)) return null
      return this.$t(`survey.${this.surveyId}.categories.${this.category}`)
    }

    /** @return Whether the number of options is evenly divisible by 2. */
    get isEven(): boolean {
      return this.options.length % 2 === 0
    }

    /**
     * Returns whether an option has been selected.
     * @param option The option.
     * @return Whether the option has been selected.
     */

    isSelected(option: Option): boolean {
      return this.selections.has(option.identifier)
    }

    /**
     * Called when the user clicks an option. Passes a `toggle` event to the {@link MultiQuestion}.
     *
     * @param option The option that was selected
     */

    toggle(option: Option): void {
      this.$emit('toggle', option.identifier)
    }
  }
</script>

<style lang="scss">
  @use "src/assets/styles/fonts";
  @use "src/assets/styles/responsive";

  .option-category {
    h1 {
      @include responsive.font-size-small;
      @include fonts.Quicksand-Thin;

      text-align: center;
    }
  }

  .option-category-uncategorized {
    h1 { opacity: 0; }

    &:first-child h1 { display: none; }
  }

  @include responsive.large {
    .option-category:not(.option-category-uncategorized) {
      .option-category-options {
        @include responsive.bottom-margin;

        column-count: 2;
      }

      .multi-option-container {
        break-inside: avoid-column;
        padding: 0.5em 0;
      }

      .option-multi {
        margin: 0;
      }
    }
  }
</style>
