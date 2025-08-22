<template>
  <div class="option option-multi" :class="{ selected: selected }" @click.prevent.stop="clicked()">
    <checkmark />
    <div class="option-link">
      <a href="#" :data-testid="option.identifier" @click.prevent.stop="clicked()">
        {{ title }}
      </a>
      <p v-if="subtitle" class="option-subtitle">
        {{ subtitle }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import Checkmark from '@/components/Question/multi/Checkmark.vue'
import useOption from '@/components/Question/hooks/option'
import { computed } from 'vue'
import { isUndefined } from 'lodash-es'
import { useI18n } from 'vue-i18n'
import type { Option } from '@/models/survey'

/**
 * Displays an {@link Option} for a {@link MultiQuestion}. The source of truth for whether an
 * option is selected is {@link MultiQuestion.choices}.
 */

const props = defineProps<{
  /** The identifier of the {@link Survey} the option is part of. */
  surveyId: string

  /** The option to display. */
  option: Option

  /** If `true`, the option should be displayed as selected. */
  selected: boolean
}>()

const emit = defineEmits<{
  clicked: []
}>()

const { t } = useI18n()
const { title, clicked } = useOption(props, emit)

/**
 * A subtitle to display below the option, if any is specified in the
 * {@link Option.data} attribute.
 */
const subtitle = computed(() => {
  if (isUndefined(props.option.data.subtitle)) {
    return null
  }
  return t(`survey.${props.surveyId}.subtitles.${props.option.data.subtitle}`)
})
</script>

<style lang="scss">
@use '@/assets/styles/colors';
@use '@/assets/styles/fonts';
@use '@/assets/styles/responsive';

.option-multi {
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  padding: 1em;
  margin: 1em 0;
  cursor: pointer;
  user-select: none;
  border-radius: 2em;
  transition: background 0.25s;

  @include colors.theme using($theme) {
    border: 1px solid colors.get($theme, 'multi-option-bg-color');
    background: linear-gradient(
      90deg,
      colors.get($theme, 'background') 0%,
      colors.get($theme, 'background') 100%
    );

    a,
    a:hover {
      color: colors.get($theme, 'multi-option-text-color');
    }
  }

  svg {
    flex: 0 0 auto;
    width: 20px;
    height: 20px;
    margin: 0 0.75em 0 0.5em;
    opacity: 0;
  }

  &.selected {
    @include colors.theme using($theme) {
      background: linear-gradient(
        90deg,
        colors.get($theme, 'multi-option-bg-color') 0%,
        colors.get($theme, 'multi-option-bg-color') 100%
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
    margin: 10px 0 0;

    @include responsive.font-size-tiny;

    @include colors.theme using($theme) {
      color: colors.get($theme, 'multi-option-text-color');
    }
  }

  @media all and (hover: hover) {
    &:not(.selected):hover {
      @include colors.theme using($theme) {
        background: linear-gradient(
          90deg,
          colors.get($theme, 'background') 0%,
          colors.get($theme, 'background') 25%,
          colors.get($theme, 'multi-option-bg-color') 100%
        );
      }
    }
  }
}
</style>
