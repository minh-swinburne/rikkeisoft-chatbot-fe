<template>
  <!--
  General description:
  This component represents the main layout for the application. It includes a header, a drawer for navigation, and a container for nested routes.

  Methods:
  - toggleLeftDrawer: Toggles the visibility of the left drawer.
  -->
  <q-layout view="hHh LpR fFf">
    <q-header bordered>
      <q-toolbar>
        <q-btn
          icon="menu"
          aria-label="Menu"
          flat
          dense
          round
          @click="toggleLeftDrawer"
        />
        <AppNavbar />
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      :width="280"
    >
      <q-list class="q-my-md">
        <q-item-label header>{{ props.label }}</q-item-label>

        <q-item
          v-for="(tab, index) in filteredTabs"
          :key="index"
          :to="tab.path"
          :style="{ borderRadius: '5px', color: 'inherit' }"
          active-class="bg-shadow-2"
          class="q-ma-sm q-pa-sm"
          clickable
          v-ripple
          @click="$router.push(tab.path)"
        >
          <q-item-section avatar>
            <q-icon :name="tab.icon" />
          </q-item-section>
          <q-item-section>
            <q-item-label>{{ tab.name }}</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container class="row justify-center">
      <slot />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { useAuthStore } from '@/plugins/stores/auth'
import { useLayoutStore } from '@/plugins/stores/layout'
import { useRouter } from 'vue-router'
import { computed } from 'vue'
import AppNavbar from '@/components/AppNavbar.vue'

const $router = useRouter()
const authStore = useAuthStore()
const layoutStore = useLayoutStore()

const props = defineProps({
  label: String,
  tabs: Array[Object],
})

const filteredTabs = computed(() => {
  return authStore.isAdmin
    ? props.tabs
    : props.tabs.filter((tab) => !$router.getRoutes().find((route) => route.name === tab.path.name).meta?.requiresAdmin)
})

const leftDrawerOpen = computed({
  get: () => layoutStore.leftDrawerOpen,
  set: (value) => layoutStore.setLeftDrawerOpen(value),
})

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value
}
</script>

<style scoped></style>
