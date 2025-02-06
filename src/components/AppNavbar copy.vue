<template>
  <q-toolbar>
    <router-link to="/" class="row items-center text-white" style="text-decoration: none">
      <app-logo size="30px" />
      <q-toolbar-title>RikkeiGPT</q-toolbar-title>
    </router-link>

    <q-space />

    <q-tabs v-model="tab" inline-label>
      <component
        v-for="item in filteredNavItems"
        :is="item.children ? QBtnDropdown : QRouteTab"
        :to="item.children ? null : item.path"
        :key="item.path"
        :name="item.path"
        :label="item.name"
        class="text-white"
        stretch
        flat
        @click="handleTabChange(item, item.path)"
      >
        <q-list v-if="item.children" bordered link>
          <q-item
            v-for="child in item.children"
            :key="child.path"
            clickable
            v-ripple
            @click="handleTabChange(child, item.path + child.path)"
          >
            <q-item-section>{{ child.name }}</q-item-section>
          </q-item>
        </q-list>
      </component>
    </q-tabs>

    <q-space />

    <q-btn
      :icon="$q.dark.isActive ? 'light_mode' : 'dark_mode'"
      class="q-mr-sm"
      flat
      round
      @click="toggleDarkMode"
    />

    <q-btn-dropdown v-if="authStore.user" flat no-caps>
      <template #label>
        <user-avatar :src="authStore.user?.avatar_url" size="30px" class="q-mr-sm" bordered />
        <span >{{ authStore.user?.firstname }} {{ authStore.user?.lastname }}</span>
      </template>
      <q-list>
        <q-item clickable v-ripple @click="$router.push('/profile')">
          <q-item-section avatar>
            <q-icon name="person" />
          </q-item-section>

          <q-item-section>Profile</q-item-section>
        </q-item>
        <q-separator />
        <q-item clickable v-ripple @click="logout">
          <q-item-section avatar>
            <q-icon :color="$q.dark.isActive ? '' : 'negative'" name="logout" />
          </q-item-section>

          <q-item-section :class="{ 'text-negative': !$q.dark.isActive }">Logout</q-item-section>
        </q-item>
      </q-list>
    </q-btn-dropdown>

    <q-btn
      v-else
      :to="{ name: 'auth-login' }"
      :color="$q.dark.isActive ? 'primary' : 'white'"
      :text-color="$q.dark.isActive ? 'white' : 'black'"
      label="Login"
      unelevated
    />
  </q-toolbar>
</template>

<script setup>
import { useLayoutStore } from '@/plugins/stores/layout'
import { useAuthStore } from '@/plugins/stores/auth'
import { useQuasar, QBtnDropdown, QRouteTab } from 'quasar'
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AppLogo from './AppLogo.vue'
import UserAvatar from '@/components/UserAvatar.vue'

const $q = useQuasar()
const $route = useRoute()
const $router = useRouter()
const authStore = useAuthStore()
const layoutStore = useLayoutStore()
// console.log($router.options.routes)

const tab = ref($route.path)

const navItems = [
  { name: 'Chat', path: '/chat' },
  { name: 'Documents', path: '/docs' },
  { name: 'Config', path: '/config' },
]

const filteredNavItems = computed(() => {
  return authStore.isAdmin
    ? navItems
    : navItems.filter(
        (item) =>
          !$router.options.routes.find((route) => route.path === item.path).meta.requiresAdmin,
      )
})

function logout() {
  authStore.logout()
  $router.push({ name: 'home' })
}

function toggleDarkMode() {
  $q.dark.set(!$q.dark.isActive)
  layoutStore.isDark = $q.dark.isActive
}

function handleTabChange(tab, path) {
  if (!tab.children) {
    $router.push(path)
  }
}
</script>

<style>
.q-tabs :is(.q-tab, .q-btn) > :is(.q-focus-helper, .q-ripple) {
  margin: 8px 4px;
  width: calc(100% - 8px) !important;
  height: calc(100% - 16px) !important;
  border-radius: 5px !important;
}
</style>
