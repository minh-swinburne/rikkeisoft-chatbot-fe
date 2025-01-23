<template>
  <q-toolbar>
    <q-toolbar-title>
      ChatApp
    </q-toolbar-title>

    <q-space />

    <q-tabs v-model="tab" inline-label>
      <q-tab 
        v-for="item in filteredNavItems" 
        :key="item.path" 
        :name="item.path" 
        :label="item.name"
        @click="navigateTo(item.path)" 
      />
    </q-tabs>

    <q-space />

    <q-btn v-if="authStore.user" flat dense>
      <q-btn-dropdown flat dense>
        <template #label>
          Welcome, {{ authStore.user?.firstname }}
        </template>
        <q-list>
          <q-item clickable v-ripple @click="navigateTo('/profile')">
            <q-item-section>Profile</q-item-section>
          </q-item>
          <q-item clickable v-ripple @click="logout">
            <q-item-section>Logout</q-item-section>
          </q-item>
        </q-list>
      </q-btn-dropdown>
    </q-btn>
    <q-btn v-else color="secondary" to="/login" label="Login" />

    <q-btn flat round :icon="$q.dark.isActive ? 'light_mode' : 'dark_mode'" @click="toggleDarkMode" />
  </q-toolbar>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import { useAuthStore } from '@/plugins/stores/auth';

const $route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const $q = useQuasar();

const isDark = ref(false)
const tab = ref($route.path);

const navItems = [
  { name: 'Chat', path: '/chat' },
  { name: 'Documents', path: '/docs' },
  { name: 'Upload', path: '/upload', requiresAdmin: true },
  { name: 'Config', path: '/config', requiresAdmin: true },
];

const filteredNavItems = computed(() => {
  return authStore.isAdmin
    ? navItems
    : navItems.filter((item) => !item.requiresAdmin);
});

function navigateTo(path) {
  router.push(path);
}

function logout() {
  authStore.logout();
  router.push('/login');
}

function toggleDarkMode() {
  isDark.value = !isDark.value
  $q.dark.set(isDark.value)
  localStorage.setItem('darkMode', isDark.value)
}
</script>
