<template>
  <a
    href="#"
    class="option option-single"
    :class="className"
    :data-cy="option.identifier"
    @click.prevent="clicked()"
  >
    {{ title }}
  </a>
</template>

<script lang="ts">
  import Component from 'vue-class-component'
  import { Prop } from 'vue-property-decorator'
  import AbstractOption from '@/components/Question/AbstractOption'

  /**
   * Displays an option for a {@link SingleQuestion}. Clicking the option immediately records the
   * answer and advances the survey.
   */

  @Component
  export default class SingleOption extends AbstractOption {
    /** The index of the option in the {@link Question.options} array. */
    @Prop({ type: Number, required: true }) index!: number

    /** @return The class name to apply to the `A` tag. */
    get className(): string {
      if (this.index < 5) return `option-${this.index + 1}`
      return 'option-more'
    }
  }
</script>

<style lang="scss">
  @use "sass:list";
  @use "sass:math";
  @use "src/assets/styles/colors";
  @use "src/assets/styles/controls";
  @use "src/assets/styles/responsive";

  .option-single {
    @include controls.button;
    @include responsive.font-size-regular;

    @include responsive.large {
      margin: 0 0.5em 0.5em;
      padding-left: 1.5em;
      padding-right: 1.5em;
    }

    @include responsive.small {
      margin: 10px 0;
    }

    break-inside: avoid;
    display: block;
    text-align: center;
  }

  .option-1 { background-color: colors.$color-1; }
  .option-2 { background-color: colors.$color-2; }
  .option-3 { background-color: colors.$color-3; }
  .option-4 { background-color: colors.$color-4; }
  .option-5 { background-color: colors.$color-5; }

  .option-more {
    background-color: list.nth(colors.$button-colors, math.random(5));
  }
</style>
