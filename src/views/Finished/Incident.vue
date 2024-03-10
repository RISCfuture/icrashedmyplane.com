<template>
  <div class="level-incident">
    <i18n-t tag="h1" keypath="finished.incident.title">
      <template #level>
        <strong>{{ t('finished.incident.level') }}</strong>
      </template>
    </i18n-t>
    <p class="level-actions">
      {{ t('finished.incident.actions') }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

/**
 * Displayed when the user completes the survey and their answers do not qualify the incident as
 * serious or as an accident.
 */

const { t } = useI18n()
</script>
