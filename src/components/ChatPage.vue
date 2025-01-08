<template>
  <div class="d-flex flex-column vh-100">
    <!-- Navigation Bar -->
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
            <li class="nav-item">
              <a class="nav-link active" aria-current="page" href="#">Chat</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="#">Upload</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="#">Profile</a>
            </li>
          </ul>
          <span class="navbar-text"> Welcome, {{ username }} </span>
        </div>
      </div>
    </nav>

    <div class="chat-container d-flex flex-grow-1 flex-shrink-1">
      <!-- Vertical Navbar -->
      <div class="chat-history d-flex flex-column bg-light border-end" style="width: 250px">
        <div class="p-3 flex-grow-1">
          <h4>Chat</h4>
          <ul class="list-unstyled mt-4">
            <li
              v-for="(chat, index) in sortedChats"
              :key="index"
              class="mb-2"
            >
              <router-link
                :to="`/chat/${chat.id}`"
                :class="{ active: $route.params.chatId === chat.id }"
                class="btn btn-outline-primary w-100"
              >
                {{ chat.name }}
              </router-link>
            </li>
          </ul>
        </div>
        <div class="p-3">
          <button class="btn btn-danger w-100" @click="logout">Logout</button>
        </div>
      </div>

      <!-- Chat Detail / Start -->
      <router-view />
    </div>
  </div>
</template>

<script setup>
import axios from "axios";
import { camelize } from "@/utils";
import { useAuthStore } from "@/stores/auth";
import { useRouter, useRoute, RouterView, RouterLink } from "vue-router";
import { onMounted, ref, computed } from "vue";

const $router = useRouter();
const $route = useRoute();
const authStore = useAuthStore();

console.log($route.params);

const chats = ref([]);
const username = ref("User"); // You can replace this with the actual username from your auth store

function logout() {
  authStore.logout();
  $router.push("/login");
}

const sortedChats = computed(() => [...chats.value].sort((a, b) => new Date(b.lastAccess) - new Date(a.lastAccess)));


onMounted(async () => {
  const response = await axios.get("http://127.0.0.1:8000/api/v1/chat");

  chats.value = camelize(response.data);

  console.log(chats.value);
});
</script>

<style scoped>
.chat-container {
  max-height: calc(100vh - 60px) !important;
}

/* Navbar styling */
.navbar {
  height: 60px !important;
}

.bg-light {
  background-color: #f8f9fa !important;
}

.border-end {
  border-right: 1px solid #dee2e6 !important;
}
</style>