<template>
  <div
    class="option-category"
    :class="{ 'option-category-uncategorized': !category, 'even-option-count': isEven }"
  >
    <h1>{{ title || 'uncategorized' }}</h1>

    <div class="option-category-options">
      <div v-for="option in options" :key="option.identifier" class="multi-option-container">
        <multi-option
          :option="option"
          :selected="isSelected(option)"
          :survey-id="surveyId"
          @clicked="toggle(option)"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import MultiOption from '@/components/Question/multi/MultiOption.vue'
import type { Option } from '@/models/survey'
import { isNil } from 'lodash-es'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

/**
 * A category of {@link Option}s to display as part of a {@link MultiQuestion}. Categories can
 * either be named (in which case they are shown under a title), or be untitled, in which case
 * they will appear as "top-level" options (effectively no category).
 *
 * The source of truth for whether an option is selected is {@link MultiQuestion.choices}.
 */

const { t } = useI18n()

const props = defineProps<{
  /** The identifier of the {@link Survey} the question belongs to. */
  surveyId: string

  /** The identifier of the category, or `null` if these are top-level options. */
  category: string | null

  /** The list of options to display. */
  options: Option[]

  /** The identifiers of the options that the user has selected. */
  selections: Set<string>
}>()

const emit = defineEmits<{
  toggle: [string]
}>()

/** The localized title for the category, or `null` for top-level options. */
const title = computed(() => {
  if (isNil(props.category)) return null
  return t(`survey.${props.surveyId}.categories.${props.category}`)
})

/** Whether the number of options is evenly divisible by 2. */
const isEven = computed(() => props.options.length % 2 === 0)

/**
 * Returns whether an option has been selected.
 * @param option The option.
 * @return Whether the option has been selected.
 */
function isSelected(option: Option) {
  return props.selections.has(option.identifier)
}

/**
 * Called when the user clicks an option. Passes a `toggle` event to the {@link MultiQuestion}.
 *
 * @param option The option that was selected
 */
function toggle(option: Option) {
  emit('toggle', option.identifier)
}
</script>

<style lang="scss">
@use '@/assets/styles/fonts';
@use '@/assets/styles/responsive';

.option-category {
  h1 {
    text-align: center;
    font-size: 18px;

    @include fonts.Quicksand-Thin;

    @include responsive.small {
      font-size: 14px;
    }
  }
}

.option-category-uncategorized {
  h1 {
    opacity: 0;
  }

  &:first-child h1 {
    display: none;
  }
}

@include responsive.large {
  .option-category:not(.option-category-uncategorized) {
    .option-category-options {
      @include responsive.bottom-margin;

      column-count: 2;
    }

    .multi-option-container {
      padding: 0.5em 0;
      break-inside: avoid-column;
    }

    .option-multi {
      margin: 0;
    }
  }
}
</style>
