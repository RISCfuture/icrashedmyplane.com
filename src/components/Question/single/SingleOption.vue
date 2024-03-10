<template>
  <a
    href="#"
    class="option option-single"
    :class="className"
    :data-testid="option.identifier"
    @click.prevent="clicked()"
  >
    {{ title }}
  </a>
</template>

<script setup lang="ts">
import useOption from '@/components/Question/hooks/option'
import { computed } from 'vue'
import type { Option } from '@/models/survey'

const props = defineProps<{
  /** The identifier of the {@link Survey} the option is part of. */
  surveyId: string

  /** The option to display. */
  option: Option

  /** The index of the option in the {@link Question.options} array. */
  index: number
}>()

const emit = defineEmits<{
  clicked: []
}>()

const { title, clicked } = useOption(props, emit)

const className = computed(() => {
  if (props.index < 5) return `option-${props.index + 1}`
  return 'option-more'
})
</script>

<style lang="scss">
@use 'sass:list';
@use 'sass:math';
@use '@/assets/styles/colors';
@use '@/assets/styles/controls';
@use '@/assets/styles/responsive';

.option-single {
  @include controls.button;
  @include responsive.font-size-regular;

  @include responsive.large {
    padding-right: 1.5em;
    padding-left: 1.5em;
    margin: 0 0.5em 0.5em;
  }

  @include responsive.small {
    margin: 10px 0;
  }

  display: block;
  text-align: center;
  break-inside: avoid;
}

.option-1 {
  background-color: colors.$color-1;
}

.option-2 {
  background-color: colors.$color-2;
}

.option-3 {
  background-color: colors.$color-3;
}

.option-4 {
  background-color: colors.$color-4;
}

.option-5 {
  background-color: colors.$color-5;
}

.option-more {
  background-color: list.nth(colors.$button-colors, math.random(5));
}
</style>
