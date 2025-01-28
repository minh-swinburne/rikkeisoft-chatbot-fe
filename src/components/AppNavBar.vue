<template>
  <q-toolbar>
    <router-link to="/" class="row items-center text-white" style="text-decoration: none;">
      <app-logo size="30px" />
      <q-toolbar-title>RikkeiGPT</q-toolbar-title>
    </router-link>

    <q-space />

    <q-tabs v-model="tab" inline-label>
      <component
        v-for="item in filteredNavItems"
        :is="item.children ? QBtnDropdown : QTab"
        :key="item.path"
        :name="item.path"
        :label="item.name"
        flat
        @click="handleTabChange(item)"
      >
        <q-list v-if="item.children" bordered link>
          <q-item
            v-for="child in item.children"
            :key="child.path"
            clickable
            v-ripple
            @click="handleTabChange(child)"
          >
            <q-item-section>{{ child.name }}</q-item-section>
          </q-item>
        </q-list>
      </component>
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
import { useQuasar, QTab, QBtnDropdown } from "quasar";
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
  {
    name: "Documents",
    path: "/docs",
    requiresAdmin: true,
    children: [
      { name: "All Documents", path: "/list" },
      { name: "Upload", path: "/upload" },
    ],
  },
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
  isDark.value = !isDark.value;
  $q.dark.set(isDark.value);
  localStorage.setItem("darkMode", isDark.value);
}

function handleTabChange(tab) {
  if (!tab.children) {
    $router.push(tab.path);
  }
}
</script>
