<template>
  <q-layout view="hHh LpR fFf">
    <q-header bordered>
      <q-toolbar>
        <q-btn icon="menu" aria-label="Menu" flat dense round @click="toggleLeftDrawer" />
        <app-navbar />
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered :width="280">
      <q-list class="q-my-md">
        <q-item-label header>Settings</q-item-label>

        <q-item
          v-for="(tab, index) in tabs"
          :key="index"
          :to="tab.path"
          :style="{ borderRadius: '5px', color: 'inherit' }"
          active-class="bg-shadow-2"
          class="q-ma-sm q-pa-sm"
          clickable
          v-ripple
          @click="$router.push(tab.path)"
        >
          <q-item-section>
            <q-item-label>{{ tab.name }}</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container class="row justify-center">
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import AppNavbar from '@/components/AppNavbar.vue'
import { useLayoutStore } from '@/plugins/stores/layout'
import { computed } from 'vue'
import { useRouter } from 'vue-router'

const $router = useRouter()
const layoutStore = useLayoutStore()

const tabs = [
  { name: 'My Profile', path: { name: 'settings-profile' } },
  { name: 'Authentication', path: { name: 'settings-auth' } },
]

const leftDrawerOpen = computed({
  get: () => layoutStore.leftDrawerOpen,
  set: (value) => layoutStore.setLeftDrawerOpen(value),
})

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value
}
</script>
