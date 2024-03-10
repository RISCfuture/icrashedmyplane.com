<template>
  <div class="level-accident">
    <i18n-t keypath="finished.accident.title" tag="h1">
      <template #level>
        <strong>{{ t('finished.accident.level') }}</strong>
      </template>
    </i18n-t>
    <p class="level-actions">
      <strong>{{ t('finished.accident.actions') }}</strong>
    </p>

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

      <h2>{{ t('finished.accidentReport.title') }}</h2>
      <i18n-t tag="p" keypath="finished.accidentReport.description" />
      <i18n-t keypath="finished.accidentReport.form" tag="p">
        <template #form6120>
          <a
            href="https://www.ntsb.gov/Documents/6120_1web_Reader.pdf"
            rel="noopener noreferrer"
            target="_blank"
          >
            {{ t('finished.accidentReport.form6120') }}
          </a>
        </template>
      </i18n-t>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

/**
 * Displayed when the user completes the survey and their answers qualify the incident as an
 * accident.
 */

const { t } = useI18n()
</script>
