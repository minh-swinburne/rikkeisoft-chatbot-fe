<template>
  <q-toolbar>
    <q-toolbar-title>
      ChatApp
    </q-toolbar-title>

    <q-space />

    <q-tabs v-model="tab" inline-label>
      <q-tab v-for="item in filteredNavItems" :key="item.path" :name="item.path" :label="item.name" :to="item.path" />
    </q-tabs>

    <q-space />

    <q-btn v-if="authStore.user" flat>
      Welcome, {{ authStore.user?.firstname }}
    </q-btn>
    <q-btn v-else color="secondary" to="/login" label="Login" />
  </q-toolbar>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRoute } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const $route = useRoute();
const authStore = useAuthStore();

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
</script>

