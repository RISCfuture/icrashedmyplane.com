<template>
  <div class="level-accident" data-cy="levelDescription">
    <i18n tag="h1" path="finished.accident.title">
      <template #level><strong>{{$t('finished.accident.level')}}</strong></template>
    </i18n>
    <p class="level-actions"><strong>{{$t('finished.accident.actions')}}</strong></p>

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

      <h2>{{$t('finished.accidentReport.title')}}</h2>
      <p v-html="$t('finished.accidentReport.description')" />
      <i18n tag="p" path="finished.accidentReport.form">
        <template #form6120>
          <a href="https://www.ntsb.gov/Documents/6120_1web_Reader.pdf" target="_blank">
            {{$t('finished.accidentReport.form6120')}}
          </a>
        </template>
      </i18n>
    </div>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue'
  import Component from 'vue-class-component'

  /**
   * Displayed when the user completes the survey and their answers qualify the incident as an
   * accident.
   */

  @Component
  export default class Accident extends Vue {
  }
</script>
