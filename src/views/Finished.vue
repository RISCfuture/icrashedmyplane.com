<template>
  <div class="level-description">
    <accident v-if="isAccident" />
    <serious-incident v-else-if="isSeriousIncident" />
    <incident v-else />
    <footer>
      <p v-if="regulationList">
        {{ t('finished.applicableRegulations', { regulations: regulationList }) }}
      </p>
      <p>{{ t('finished.disclaimer') }}</p>
    </footer>
  </div>
</template>

<script setup lang="ts">
import Accident from '@/views/Finished/Accident.vue'
import Incident from '@/views/Finished/Incident.vue'
import SeriousIncident from '@/views/Finished/SeriousIncident.vue'
import { useI18n } from 'vue-i18n'
import useQuestionnaireStore from '@/stores/questionnaire'
import { storeToRefs } from 'pinia'
import { computed } from 'vue'
import { IncidentLevel } from '@/models/survey'
import useCLDR from '@/i18n/cldr'

/**
 * Displayed when all surveys are complete. Displays the proper instructions for the final
 * incident level.
 */

const { t } = useI18n()

const store = useQuestionnaireStore()
const { incidentLevel, allApplicableRegulations } = storeToRefs(store)

const { list } = useCLDR()

const isAccident = computed(() => incidentLevel.value === IncidentLevel.ACCIDENT)
const isSeriousIncident = computed(() => incidentLevel.value === IncidentLevel.SERIOUS_INCIDENT)

/**
 * A localized list of the applicable regulations in 49 CFR, or `null` if no regulations
 * apply.
 */
const regulationList = computed(() => {
  if (allApplicableRegulations.value.size === 0) return null
  return list(Array.from(allApplicableRegulations.value))
})
</script>

<style lang="scss">
@use '@/assets/styles/colors';
@use '@/assets/styles/fonts';
@use '@/assets/styles/responsive';

.level-description {
  max-width: 500px;
  margin-right: auto;
  margin-left: auto;

  h2 {
    text-align: center;

    @include responsive.top-margin;
  }

  h1 {
    @include fonts.Quicksand-Regular;
    @include responsive.bottom-margin;

    strong {
      @include colors.theme using($theme) {
        color: colors.get($theme, 'header-alternate-color');
      }
    }
  }

  .level-actions {
    font-size: 18px;
    margin-bottom: 80px;

    @include fonts.Quicksand-Thin;

    @include responsive.small {
      font-size: 14px;
      margin-bottom: 50px;
    }
  }
}
</style>
