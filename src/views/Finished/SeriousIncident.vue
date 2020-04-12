<template>
  <div class="level-serious-incident" data-cy="levelDescription">
    <i18n tag="h1" path="finished.seriousIncident.title">
      <template #level><strong>{{$t('finished.seriousIncident.level')}}</strong></template>
    </i18n>
    <i18n tag="p" path="finished.seriousIncident.actions">
      <template #notifyImmediately>
        <strong>{{$t('finished.seriousIncident.notifyImmediately')}}</strong>
      </template>
    </i18n>

    <div class="level-action-details">
      <h2>{{$t('finished.immediateNotification.title')}}</h2>
      <p v-html="$t('finished.immediateNotification.description')" />
      <i18n tag="p" path="finished.immediateNotification.contact">
        <template #URL>
          <a href="https://www.ntsb.gov/about/Pages/OfficeLocation.aspx" target="_blank">
            ntsb.gov</a>
        </template>
      </i18n>
      <p v-html="$t('finished.immediateNotification.whatToInclude')" />
    </div>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue'
  import Component from 'vue-class-component'

  /**
   * Displayed when the user completes the survey and their answers qualify the incident as serious.
   */

  @Component
  export default class SeriousIncident extends Vue {
  }
</script>
