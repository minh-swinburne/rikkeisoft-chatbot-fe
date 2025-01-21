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

    <q-btn v-if="authStore.user" flat>
      Welcome, {{ authStore.user?.firstname }}
    </q-btn>
    <q-btn v-else color="secondary" to="/login" label="Login" />

    <q-btn flat round :icon="$q.dark.isActive ? 'light_mode' : 'dark_mode'" @click="toggleDarkMode" />
  </q-toolbar>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import { useAuthStore } from '@/stores/auth';

const $route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const $q = useQuasar();

const tab = ref($route.path);

const navItems = [
  { name: 'Chat', path: '/chat' },
  { name: 'Documents', path: '/docs' },
  { name: 'Profile', path: '/profile' },
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

function toggleDarkMode() {
  $q.dark.toggle();
}
</script>