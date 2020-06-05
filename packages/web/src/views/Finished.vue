<template>
  <div class="level-description">
    <accident v-if="isAccident" />
    <serious-incident v-else-if="isSeriousIncident" />
    <incident v-else />
    <footer>
      <p v-if="regulationList">
        {{$t('finished.applicableRegulations', {regulations: regulationList})}}
      </p>
      <p>{{$t('finished.disclaimer')}}</p>
    </footer>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue'
  import Component from 'vue-class-component'
  import { Getter } from 'vuex-class'
  import { IncidentLevel } from 'i-just-crashed-my-plane-survey'
  import Accident from '@/views/Finished/Accident.vue'
  import SeriousIncident from '@/views/Finished/SeriousIncident.vue'
  import Incident from '@/views/Finished/Incident.vue'
  import { list } from '@/i18n/functions'

  /**
   * Displayed when all surveys are complete. Displays the proper instructions for the final
   * incident level.
   */

  @Component({
    components: { Incident, SeriousIncident, Accident }
  })
  export default class Finished extends Vue {
    @Getter incidentLevel!: IncidentLevel

    @Getter allApplicableRegulations!: Set<string>

    /** @return `true` if the incident level is ACCIDENT. */
    get isAccident(): boolean {
      return this.incidentLevel === IncidentLevel.ACCIDENT
    }

    /** @return `true` if the incident level is SERIOUS INCIDENT. */
    get isSeriousIncident(): boolean {
      return this.incidentLevel === IncidentLevel.SERIOUS_INCIDENT
    }

    /**
     * @return A localized list of the applicable regulations in 49 CFR, or `null` if no regulations
     * apply.
     */

    get regulationList(): string | null {
      if (this.allApplicableRegulations.size === 0) return null
      return list(Array.from(this.allApplicableRegulations))
    }
  }
</script>

<style lang="scss">
  @use 'src/assets/styles/colors';
  @use 'src/assets/styles/fonts';
  @use 'src/assets/styles/responsive';

  .level-description {
    margin-left: auto;
    margin-right: auto;
    max-width: 500px;

    h2 {
      @include responsive.top-margin;
      text-align: center;
    }

    h1 {
      @include responsive.bottom-margin;
      @include fonts.Quicksand-Regular;

      strong {
        @include colors.theme using($theme) {
          color: colors.get($theme, 'header-alternate-color');
        }
      }
    }

    .level-actions {
      @include fonts.Quicksand-Thin;
      @include responsive.font-size-small;
      @include responsive.bottom-margin-large;
    }
  }
</style>
