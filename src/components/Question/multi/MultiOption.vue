<template>
  <div class="option option-multi" :class="{ selected: selected }" @click.prevent.stop="clicked()">
    <checkmark />
    <div class="option-link">
      <a
        href="#"
        @click.prevent.stop="clicked()"
        :data-cy="option.identifier">
        {{title}}
      </a>
      <p v-if="subtitle" class="option-subtitle">{{subtitle}}</p>
    </div>
  </div>
</template>

<script lang="ts">
  import Component from 'vue-class-component'
  import { Prop } from 'vue-property-decorator'
  import { isUndefined } from 'lodash-es'
  import { TranslateResult } from 'vue-i18n'
  import AbstractOption from '@/components/Question/AbstractOption'
  import Checkmark from '@/components/Question/multi/Checkmark.vue'

  /**
   * Displays an {@link Option} for a {@link MultiQuestion}. The source of truth for whether an
   * option is selected is {@link MultiQuestion.choices}.
   */

  @Component({
    components: { Checkmark }
  })
  export default class MultiOption extends AbstractOption {
    /** If `true`, the option should be displayed as selected. */
    @Prop({ type: Boolean, default: false }) selected!: boolean

    /**
     * @return A subtitle to display below the option, if any is specified in the
     * {@link Option.data} attribute.
     */

    get subtitle(): TranslateResult | null {
      if (isUndefined(this.option.data.subtitle)) {
        return null
      }
      return this.$t(`survey.${this.surveyId}.subtitles.${this.option.data.subtitle}`)
    }
  }
</script>

<style lang="scss">
  @use "src/assets/styles/colors";
  @use "src/assets/styles/fonts";
  @use "src/assets/styles/responsive";

  .option-multi {
    @include colors.theme using ($theme) {
      border: 1px solid colors.get($theme, "multi-option-bg-color");
    }

    align-items: center;
    border-radius: 2em;
    cursor: pointer;
    display: flex;
    flex-flow: row nowrap;
    margin: 1em 0;
    padding: 1em;
    transition: background 0.25s;
    user-select: none;

    @include colors.theme using ($theme) {
      background:
        linear-gradient(
          90deg,
          colors.get($theme, "background") 0%,
          colors.get($theme, "background") 100%
        );
    }

    @include colors.theme using($theme) {
      a,
      a:hover {
        color: colors.get($theme, "multi-option-text-color");
      }
    }

    svg {
      flex: 0 0 auto;
      height: 20px;
      margin: 0 0.75em 0 0.5em;
      opacity: 0;
      width: 20px;
    }

    &.selected {
      @include colors.theme using ($theme) {
        background:
          linear-gradient(
            90deg,
            colors.get($theme, "multi-option-bg-color") 0%,
            colors.get($theme, "multi-option-bg-color") 100%
          );
      }

      svg {
        opacity: 1;
      }
    }

    .option-link {
      flex: 1 1 auto;
    }

    .option-subtitle {
      @include responsive.font-size-tiny;

      @include colors.theme using ($theme) {
        color: colors.get($theme, "multi-option-text-color");
      }

      margin: 10px 0 0;
    }

    @media all and (hover: hover) {
      &:not(.selected):hover {
        @include colors.theme using ($theme) {
          background:
            linear-gradient(
              90deg,
              colors.get($theme, "background") 0%,
              colors.get($theme, "background") 25%,
              colors.get($theme, "multi-option-bg-color") 100%
            );
        }
      }
    }
  }
</style>
