<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-light border-bottom">
    <div class="container-fluid">
      <a class="navbar-brand" href="#">ChatApp</a>
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
          <li
            v-for="(item, index) in navItems"
            :key="index"
            class="nav-item"
          >
            <router-link
              :to="item.path"
              :class="{ active: $route.path === item.path }"
              class="nav-link">
              {{ item.name }}
            </router-link>
          </li>
        </ul>
        <span class="navbar-text"> Welcome, {{ authStore.user.firstname }} </span>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { useAuthStore } from "@/stores/auth";
import { RouterLink, useRoute } from "vue-router";

const $route = useRoute();
const authStore = useAuthStore();
const navItems = [
  { name: "Chat", path: "/chat" },
  { name: "Profile", path: "/profile" },
  { name: "Upload", path: "/upload" },
];

</script>

<style scoped>
/* Navbar styling */
.navbar {
  height: 60px;
}
</style>