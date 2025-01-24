<template>
  <q-toolbar>
    <app-logo size="30px" />

    <q-toolbar-title>RikkeiGPT</q-toolbar-title>

    <q-space />

    <q-tabs v-model="tab" inline-label>
      <q-tab
        v-for="item in filteredNavItems"
        :key="item.path"
        :name="item.path"
        :label="item.name"
        @click="$router.push(item.path)"
      />
    </q-tabs>

    <q-space />

    <q-btn
      flat
      round
      :icon="$q.dark.isActive ? 'light_mode' : 'dark_mode'"
      @click="toggleDarkMode"
    />

    <q-btn-dropdown v-if="authStore.user" flat no-caps>
      <template #label> Welcome, {{ authStore.user?.firstname }} </template>
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

          <q-item-section :class="{ 'text-negative': !$q.dark.isActive }"
            >Logout</q-item-section
          >
        </q-item>
      </q-list>
    </q-btn-dropdown>
    <q-btn v-else color="secondary" to="/login" label="Login" />
  </q-toolbar>
</template>

<script setup>
import { useAuthStore } from "@/plugins/stores/auth";
import { useQuasar } from "quasar";
import { computed, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import AppLogo from "./AppLogo.vue";

const $q = useQuasar();
const $route = useRoute();
const $router = useRouter();
const authStore = useAuthStore();

const isDark = ref(localStorage.getItem("darkMode") === "true");
const tab = ref($route.path);

const navItems = [
  { name: "Chat", path: "/chat" },
  { name: "Documents", path: "/docs" },
  { name: "Upload", path: "/upload", requiresAdmin: true },
  { name: "Config", path: "/config", requiresAdmin: true },
];

const filteredNavItems = computed(() => {
  return authStore.isAdmin
    ? navItems
    : navItems.filter((item) => !item.requiresAdmin);
});

function logout() {
  authStore.logout();
  $router.push("/login");
}

function toggleDarkMode() {
  $q.dark.toggle(); 
  isDark.value = $q.dark.isActive; 
  localStorage.setItem("darkMode", isDark.value); 
  console.log($q.dark.isActive);
}

</script>
