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
$headings: h1, h2, h3, h4, h5, h6;
$text-classes: ".text-h1", ".text-h2", ".text-h3", ".text-h4", ".text-h5", ".text-h6";

#app {
  font-family: ui-sans-serif,system-ui,-apple-system,Segoe UI,Helvetica,Apple Color Emoji,Arial,sans-serif,Segoe UI Emoji,Segoe UI Symbol;
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

p, #{$headings}, #{$text-classes}, .ellipsis {
  padding-bottom: 2px;
}

.link {
  color: $primary;
}

.table-stripe {
  tbody {
    tr:nth-child(odd) {
      background-color: white;
      --tw-gradient-to: white;
    }
    tr:nth-child(even) {
      background-color: $grey-2;
      --tw-gradient-to: #{$grey-2};
    }
  }
}

.table-sticky-last-col {
  th:last-child,
  td:last-child {
    position: sticky;
    right: -1px;
    z-index: 1;
  }

  td:last-child {
    background-color: transparent !important;
  }
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

.q-item__section--avatar {
  min-width: 40px !important;
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

  .table-stripe {
    tbody {
      tr:nth-child(odd) {
        background-color: $grey-15;
        --tw-gradient-to: #{$grey-15};
      }
      tr:nth-child(even) {
        background-color: $grey-16;
        --tw-gradient-to: #{$grey-16};
      }
    }
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

.v-enter-active,
.v-leave-active {
  transition: opacity 0.25s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>
