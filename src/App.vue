<template>
  <q-layout view="hHh Lpr fFf">
    <q-page-container>
      <!-- The component for the current route will be rendered here -->
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { useQuasar } from 'quasar'
import { useLayoutStore } from '@/plugins/stores/layout'

const $q = useQuasar()
const layoutStore = useLayoutStore()

$q.dark.set(layoutStore.isDark)
</script>

<style lang="scss">
#app {
  font-family: ui-sans-serif,-apple-system,system-ui,Segoe UI,Helvetica,Apple Color Emoji,Arial,sans-serif,Segoe UI Emoji,Segoe UI Symbol;
  background-color: $light;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  scrollbar-color: $grey-7 transparent;
  /* text-align: center; */
  /* color: #2c3e50; */
}

a {
  color: black;
  text-decoration: none;
}

.link {
  color: $primary;
}

.q-page .q-list {
  background: white;
}

.q-field--error {
  margin-bottom: 8px;
}

.q-tabs .q-tabs__arrow {
  display: flex;
  align-items: center;
}

input:is(:-webkit-autofill, :autofill) {
  -webkit-background-clip: text;
  -webkit-text-fill-color: black;
  transition: background-color 5000s ease-in-out 0s;
  box-shadow: inset 0 0 0 500px white !important;

  &:hover,
  &:focus,
  &:active {
    /* Inherit the same styles as base autofill */
    // This has no effect, just to avoid the empty rule warning
    background-color: transparent !important;
  }
}

.body--dark {
  a {
    color: white;
  }

  input:is(:-webkit-autofill, :autofill) {
    -webkit-text-fill-color: white;
    box-shadow: inset 0 0 0 500px $grey-17 !important;
  }

  .link {
    color: $link;
  }

  .q-header,
  .q-drawer {
    background: $dark-page !important;
  }

  .q-page-container {
    background: $dark !important;
  }

  .q-card,
  .q-tab-panels,
  .q-page .q-list {
    background: $grey-17;
  }
}
</style>
