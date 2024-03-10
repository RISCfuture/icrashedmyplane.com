<template>
  <div id="welcome">
    <article>
      <h1>{{ t('welcome.title') }}</h1>
      <p>{{ t('welcome.description') }}</p>
      <transition appear name="in-fade-2">
        <p>
          <button type="button" @click="clickContinue()">
            {{ t('welcome.startButton') }}
          </button>
        </p>
      </transition>
    </article>

    <i18n-t tag="footer" keypath="welcome.footer">
      <template #me>
        <a href="https://tim.codes" target="_blank" rel="noopener noreferrer">Tim Morgan</a>
      </template>
    </i18n-t>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import useQuestionnaireStore from '@/stores/questionnaire'

/**
 * Displayed if no surveys have been started. Introduces the user to the website.
 */

const { t } = useI18n()
const { clickContinue } = useQuestionnaireStore()
</script>

<style scoped lang="scss">
@use '@/assets/styles/colors';
@use '@/assets/styles/fonts';
@use '@/assets/styles/responsive';

article {
  flex: 1 1 auto;
}

h1 {
  @include fonts.Quicksand-Bold;
  @include responsive.font-size-very-large;
  @include responsive.bottom-margin-large;

  text-align: center;
}

p {
  @include fonts.Quicksand-Medium;
  @include responsive.bottom-margin-large;

  max-width: 500px;
  margin-right: auto;
  margin-left: auto;
  text-align: center;
}

button {
  @include colors.theme using($theme) {
    color: colors.get($theme, 'button-text-color');
    background-color: colors.$color-1;
  }
}
</style>

<style scoped lang="scss">
footer {
  flex: 0 0 auto;
  text-align: center;
}
</style>
