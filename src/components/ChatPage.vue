<template>
  <div class="d-flex flex-column vh-100">
    <!-- Navigation Bar -->
    <nav-bar></nav-bar>

    <div class="chat-container d-flex flex-grow-1">
      <!-- Vertical Navbar -->
      <div class="chat-sidebar bg-light border-end">
        <div class="p-3">
          <button class="btn btn-primary w-100" @click="createNewChat">
            + New Chat
          </button>
        </div>
        <div class="chat-history p-3 flex-grow-1 overflow-auto">
          <h4>Chat History</h4>
          <ul class="list-unstyled mt-4">
            <li v-for="(chat, index) in sortedChats" :key="index" class="mb-2 position-relative">
              <router-link
                :to="`/chat/${chat.id}`"
                :class="{ active: $route.params.chatId === chat.id }"
                class="btn btn-outline-primary w-100 text-start text-truncate"
              >
                {{ chat.name }}
              </router-link>
              <div class="dropdown position-absolute top-0 end-0 h-100">
                <button class="btn btn-sm btn-outline-primary h-100" type="button" id="dropdownMenuButton" data-bs-toggle="dropdown" aria-expanded="false">
                  ...
                </button>
                <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                  <li><a class="dropdown-item" href="#" @click="renameChat(chat)">Rename</a></li>
                  <li><a class="dropdown-item" href="#" @click="deleteChat(chat)">Delete</a></li>
                </ul>
              </div>
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
import NavBar from "@/components/NavBar.vue";
import { camelize } from "@/utils";
import { useAuthStore } from "@/stores/auth";
import { computed, onMounted, ref } from "vue";
import { RouterLink, RouterView, useRouter } from "vue-router";

const $router = useRouter();
const authStore = useAuthStore();

const chats = ref([]);

function logout() {
  authStore.logout();
  $router.push("/login");
}

const sortedChats = computed(() =>
  [...chats.value].sort(
    (a, b) => new Date(b.lastAccess) - new Date(a.lastAccess)
  )
);

async function createNewChat() {
  try {
    const send = await axios.post("http://127.0.0.1:8000/api/v1/chats", {
      name: "New Chat",
      user_id: authStore.user.sub,
    });
    const newChat = camelize(send.data);
    chats.value.push(newChat);

    const response = await axios.get("http://127.0.0.1:8000/api/v1/chats", {
    params: {
      user_id: authStore.user.sub,
    },
  });
    chats.value = camelize(response.data);
  } catch (error) {
    console.error("Error creating new chat:", error);
  }
}

async function renameChat(chat) {
  const newName = prompt("Enter new chat name:", chat.name);

  if (newName && newName !== chat.name) {
    try {
      // Send name and user_id in the request body

      console.log("Name:", newName)
      await axios.put(`http://127.0.0.1:8000/api/v1/chats/${chat.id}/rename`, {
        name: newName,
        user_id: authStore.user.sub,
      });
      chat.name = newName;
      
      const response = await axios.get("http://127.0.0.1:8000/api/v1/chats", {
    params: {
      user_id: authStore.user.sub,
    },
  });
      chats.value = camelize(response.data);
    } catch (error) {
      console.error("Error renaming chat:", error);
    }
  }
}

async function deleteChat(chat) {
  try {
    console.log("chatId to delete:", chat.id); // Debugging line
    await axios.delete(`http://127.0.0.1:8000/api/v1/chats/${chat.id}/delete`);
    chats.value = chats.value.filter(chat => chat.id !== chat.id);

    const response = await axios.get("http://127.0.0.1:8000/api/v1/chats", {
    params: {
      user_id: authStore.user.sub,
    },
  });
    chats.value = camelize(response.data);
  } catch (error) {
    console.error("Error deleting chat:", error);
  }
}



onMounted(async () => {
  const response = await axios.get("http://127.0.0.1:8000/api/v1/chats", {
    params: {
      user_id: authStore.user.sub,
    },
  });

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
  height: calc(100% - 120px);
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

.dropdown {
  opacity: 0;
  transition: opacity 0.2s;
}

li:hover .dropdown {
  opacity: 1;
}

.dropdown-menu {
  min-width: 100px;
}

.h-100{
  height: 100%
}
</style>