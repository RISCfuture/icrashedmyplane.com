<template>
  <div id="app">
    <a class="skip-link" href="#main-content">{{ t('a11y.skipToContent') }}</a>
    <main id="main-content">
      <container />
    </main>
  </div>
</template>

<script setup lang="ts">
import Container from '@/views/Container.vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>

<style lang="scss">
#app {
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  justify-content: center;
}

#main-content {
  display: contents;
}

.skip-link {
  position: absolute;
  top: -40px;
  left: 8px;
  z-index: 1000;
  padding: 8px 16px;
  background-color: #001c55;
  color: #fff;
  border-radius: 4px;
  text-decoration: none;
  transform: translateY(-100%);
  transition: transform 0.2s ease-in-out;

  &:focus,
  &:focus-visible {
    top: 8px;
    transform: translateY(0);
    outline: 2px solid #a6e1fa;
    outline-offset: 2px;
  }
}

@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.001ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.001ms !important;
    scroll-behavior: auto !important;
  }
}
</style>
