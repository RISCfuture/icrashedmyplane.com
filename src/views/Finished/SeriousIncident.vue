<template>
  <div class="level-serious-incident" data-cy="levelDescription">
    <i18n tag="h1" path="level.seriousIncident.title">
      <template #level><strong>{{$t('level.seriousIncident.level')}}</strong></template>
    </i18n>
    <i18n tag="p" path="level.seriousIncident.actions">
      <template #notifyImmediately>
        <strong>{{$t('level.seriousIncident.notifyImmediately')}}</strong>
      </template>
    </i18n>

    <div class="level-action-details">
      <h2>{{$t('level.immediateNotification.title')}}</h2>
      <p v-html="$t('level.immediateNotification.description')" />
      <i18n tag="p" path="level.immediateNotification.contact">
        <template #URL>
          <a href="https://www.ntsb.gov/about/Pages/OfficeLocation.aspx" target="_blank">
            https://www.ntsb.gov/about/Pages/OfficeLocation.aspx</a>
        </template>
      </i18n>
      <p v-html="$t('level.immediateNotification.whatToInclude')" />
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
