<template>
  <div class="level-description">
    <accident v-if="isAccident" />
    <serious-incident v-else-if="isSeriousIncident" />
    <incident v-else />
  </div>
</template>

<script lang="ts">
  import Vue from 'vue'
  import Component from 'vue-class-component'
  import { Getter } from 'vuex-class'
  import { IncidentLevel } from '@/models/survey'
  import Accident from '@/views/Finished/Accident.vue'
  import SeriousIncident from '@/views/Finished/SeriousIncident.vue'
  import Incident from '@/views/Finished/Incident.vue'

  /**
   * Displayed when all surveys are complete. Displays the proper instructions for the final
   * incident level.
   */

  @Component({
    components: { Incident, SeriousIncident, Accident }
  })
  export default class Finished extends Vue {
    @Getter incidentLevel!: IncidentLevel

    get isAccident(): boolean {
      return this.incidentLevel === IncidentLevel.ACCIDENT
    }

    get isSeriousIncident(): boolean {
      return this.incidentLevel === IncidentLevel.SERIOUS_INCIDENT
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
