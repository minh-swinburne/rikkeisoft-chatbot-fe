<template>
  <q-layout view="hHh Lpr fFf">
    <q-page-container>
      <!-- The component for the current route will be rendered here -->
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { provide } from 'vue'
import { useQuasar } from 'quasar'
import { useDark } from '@vueuse/core'

const $q = useQuasar()
const isDark = useDark({ storageKey: 'dark' })

provide('isDark', isDark)
$q.dark.set(isDark.value)
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

.q-field--error {
  margin-bottom: 8px;
}

a, .link {
  color: $primary;
}
.body--dark a, .body--dark .link {
  color: $link;
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
    box-shadow: inset 0 0 0 500px var(--q-dark) !important;
  }
}
</style>
