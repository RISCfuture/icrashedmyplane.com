<template>
  <div id="welcome">
    <article>
      <h1>{{$t('welcome.title')}}</h1>
      <p>{{$t('welcome.description')}}</p>
      <transition appear name="in-fade-2">
        <p>
          <button @click="clickContinue()" data-cy="startButton">
            {{$t('welcome.startButton')}}
          </button>
        </p>
      </transition>
    </article>

    <i18n tag="footer" path="welcome.footer">
      <template #me>
        <a href="https://tim.codes" target="_blank" rel="noreferrer">Tim Morgan</a>
      </template>
    </i18n>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue'
  import Component from 'vue-class-component'
  import { Action } from 'vuex-class'

  /**
   * Displayed if no surveys have been started. Introduces the user to the website.
   */

  @Component
  export default class Welcome extends Vue {
    @Action clickContinue!: () => void
  }
</script>

<style lang="scss">
  #welcome {
    display: flex;
    flex-flow: column nowrap;
  }
</style>

<style scoped lang="scss">
  @use "src/assets/styles/colors";
  @use "src/assets/styles/fonts";
  @use "src/assets/styles/responsive";

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

    margin-left: auto;
    margin-right: auto;
    max-width: 500px;
    text-align: center;
  }

  button {
    @include colors.theme using($theme) {
      background-color: colors.$color-1;
      color: colors.get($theme, "button-text-color");
    }
  }
</style>

<style scoped lang="scss">
  footer {
    flex: 0 0 auto;
    text-align: center;
  }
</style>
