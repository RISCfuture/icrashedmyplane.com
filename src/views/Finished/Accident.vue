<template>
  <div class="level-accident" data-cy="levelDescription">
    <i18n tag="h1" path="level.accident.title">
      <template #level><strong>{{$t('level.accident.level')}}</strong></template>
    </i18n>
    <p class="level-actions"><strong>{{$t('level.accident.actions')}}</strong></p>

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

      <h2>{{$t('level.accidentReport.title')}}</h2>
      <p v-html="$t('level.accidentReport.description')" />
      <i18n tag="p" path="level.accidentReport.form">
        <template #form6120>
          <a href="https://www.ntsb.gov/Documents/6120_1web_Reader.pdf" target="_blank">
            {{$t('level.accidentReport.form6120')}}
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
