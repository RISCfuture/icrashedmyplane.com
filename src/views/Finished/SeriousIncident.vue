<template>
  <div class="level-serious-incident">
    <i18n-t keypath="finished.seriousIncident.title" tag="h1">
      <template #level>
        <strong>{{ t('finished.seriousIncident.level') }}</strong>
      </template>
    </i18n-t>
    <i18n-t keypath="finished.seriousIncident.actions" tag="p">
      <template #notifyImmediately>
        <strong>{{ t('finished.seriousIncident.notifyImmediately') }}</strong>
      </template>
    </i18n-t>

    <div class="level-action-details">
      <h2>{{ t('finished.immediateNotification.title') }}</h2>
      <i18n-t tag="p" keypath="finished.immediateNotification.description" />
      <i18n-t keypath="finished.immediateNotification.contact" tag="p">
        <template #URL>
          <a
            href="https://www.ntsb.gov/about/Pages/OfficeLocation.aspx"
            rel="noopener noreferrer"
            target="_blank"
          >
            ntsb.gov</a
          >
        </template>
      </i18n-t>
      <i18n-t tag="p" keypath="finished.immediateNotification.whatToInclude" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

/**
 * Displayed when the user completes the survey and their answers qualify the incident as serious.
 */

const { t } = useI18n()
</script>
