<template>
  <div id="error">
    <h1>{{$t('error.title')}}</h1>
    <p>{{$t('error.description')}}</p>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue'
  import Component from 'vue-class-component'

  /**
   * Displayed when an error occurs while taking a survey.
   */

  @Component
  export default class Error extends Vue {
  }
</script>
