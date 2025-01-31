<template>
  <q-layout view="hHh LpR fFf" :class="{ 'bg-dark': $q.dark.isActive }">
    <q-header bordered :class="$q.dark.isActive ? 'bg-dark' : 'bg-primary'">
      <q-toolbar>
        <q-btn
          icon="menu"
          aria-label="Menu"
          flat
          dense
          round
          @click="toggleLeftDrawer"
        />
        <app-navbar />
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      :width="280"
      :class="$q.dark.isActive ? 'bg-dark' : 'bg-grey-1'"
    >
      <q-list class="q-my-md">
        <q-item
          v-for="(tab, index) in tabs"
          :key="index"
          :to="tab.path"
          :active-class="$q.dark.isActive ? 'bg-grey-15' : 'bg-grey-4'"
          :style="{ borderRadius: '5px', color: 'inherit' }"
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

    <q-page-container class="row justify-center" :class="{ 'bg-grey-17': $q.dark.isActive }">
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import AppNavbar from '@/components/AppNavbar.vue'
import { useLayoutStore } from '@/plugins/stores/layout'
import { useQuasar } from 'quasar'
import { useRouter } from 'vue-router'
import { computed } from 'vue'

const $q = useQuasar()
const $router = useRouter()
const layoutStore = useLayoutStore()

const tabs = [
  { name: 'View Documents', path: { name: 'docs-list' } },
  { name: 'Upload Document', path: { name: 'docs-upload' } },
]

const leftDrawerOpen = computed({
  get: () => layoutStore.leftDrawerOpen,
  set: (value) => layoutStore.setLeftDrawerOpen(value),
})

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value
}
</script>

<style scoped></style>
