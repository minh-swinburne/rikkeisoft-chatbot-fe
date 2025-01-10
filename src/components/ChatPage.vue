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
              <router-link class="nav-link" to="/upload">Upload</router-link>
              <!-- <a class="nav-link" href="#">Upload</a> -->
            </li>
            <li class="nav-item">
              <a class="nav-link" href="#">Profile</a>
            </li>
          </ul>
          <span class="navbar-text"> Welcome, {{ username }} </span>
        </div>
      </div>
    </nav>

    <div class="chat-container d-flex flex-grow-1">
      <!-- Vertical Navbar -->
      <div class="chat-sidebar bg-light border-end">
        <div class="p-3">
          <button class="btn btn-primary w-100" @click="createNewChat">New Chat</button>
        </div>
        <div class="chat-history p-3 flex-grow-1 overflow-auto">
          <h4>Chat History</h4>
          <ul class="list-unstyled mt-4">
            <li
              v-for="(chat, index) in sortedChats"
              :key="index"
              class="mb-2"
            >
              <router-link
                :to="`/chat/${chat.id}`"
                :class="{ active: $route.params.chatId === chat.id }"
                class="btn btn-outline-primary w-100 text-start text-truncate"
              >
                {{ chat.name }}
              </router-link>
            </li>
          </ul>
        </div>
        <div class="p-3 mt-auto">
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
import { onMounted, ref, computed } from "vue";
import { useRouter, RouterView, RouterLink } from "vue-router";
// import { googleLogout } from "vue3-google-login"

const $router = useRouter();
const authStore = useAuthStore();

// console.log($route.params);

const chats = ref([]);
const username = ref("User"); // You can replace this with the actual username from your auth store

function logout() {
  authStore.logout();
  $router.push("/login");
}

// const logout = async () => {
//   try {
//     // Optional: Call your backend API to invalidate the token
//     // await fetch('your-api-url/logout', {
//     //   method: 'POST',
//     //   headers: {
//     //     'Authorization': `Bearer ${localStorage.getItem('jwt')}`
//     //   }
//     // });

//     // Clear the JWT token from localStorage
//     localStorage.removeItem('jwt');
//     googleLogout()
//     // Redirect to the login page
//     $router.push('/login');
//   } catch (error) {
//     console.error('Logout failed:', error);
//   }
// };

const sortedChats = computed(() => [...chats.value].sort((a, b) => new Date(b.lastAccess) - new Date(a.lastAccess)));

async function createNewChat() {
  try {
    const send = await axios.post("http://127.0.0.1:8000/api/v1/chat");
    const newChat = camelize(send.data);
    chats.value.push(newChat);

    const response = await axios.get("http://127.0.0.1:8000/api/v1/chat");
    chats.value = camelize(response.data);

  } catch (error) {
    console.error("Error creating new chat:", error);
  }
}

onMounted(async () => {
  const response = await axios.get("http://127.0.0.1:8000/api/v1/chat");

  chats.value = camelize(response.data);

  console.log(chats.value);
});
</script>

<style scoped>
.chat-container {
  height: calc(100vh - 60px);
}

/* Navbar styling */
.navbar {
  height: 60px;
}

.bg-light {
  background-color: #f8f9fa !important;
}

.border-end {
  border-right: 1px solid #dee2e6 !important;
}

.chat-sidebar {
  width: 300px;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
}

.chat-history {
  height: calc(100% - 120px); /* Adjust based on the height of New Chat button and Logout button */
}

.chat-content {
  overflow-y: auto;
}

.overflow-auto {
  overflow-y: auto;
}

.text-truncate {
  max-width: 100%;
}
</style>