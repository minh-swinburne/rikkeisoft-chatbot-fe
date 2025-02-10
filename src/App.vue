<template>
  <q-layout view="hHh Lpr fFf">
    <q-page-container>
      <!-- The component for the current route will be rendered here -->
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { useLayoutStore } from '@/plugins/stores/layout'
import { useQuasar } from 'quasar'

const $q = useQuasar()
const layoutStore = useLayoutStore()

$q.dark.set(layoutStore.isDark)
</script>

<style lang="scss">
#app {
  font-family: Roboto, Inter, Avenir, Helvetica, Arial, sans-serif;
  background-color: $light;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  scrollbar-color: $grey-7 transparent;
  /* text-align: center; */
  /* color: #2c3e50; */
}

// ::-webkit-scrollbar {
//   background: transparent;
// }
// ::-webkit-scrollbar-thumb {
//   width: 8px;
//   border-radius: 4px;
//   background-color: lightgrey;
//   background-clip: padding-box;
// }

.q-page .q-list {
  background: white;
}

.q-field--error {
  margin-bottom: 8px;
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
  input:is(:-webkit-autofill, :autofill) {
    -webkit-text-fill-color: white;
    box-shadow: inset 0 0 0 500px $grey-17 !important;
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
