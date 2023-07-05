<template>
  <div id="app">
    <container />
  </div>
</template>

<script lang="ts">
  import Vue from 'vue'
  import Component from 'vue-class-component'
  import Container from '@/views/Container.vue'

  /**
   * Root view for the application.
   */

  @Component({
    components: { Container },
  })
  export default class App extends Vue {
  }
</script>

<style lang="scss">
  #app {
    align-items: center;
    display: flex;
    flex-flow: row nowrap;
    justify-content: center;
  }
</style>
