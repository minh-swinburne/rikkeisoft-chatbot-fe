<template>
  <q-page class="flex flex-center">
    <div class="text-center">
      <h1 class="text-h3 q-mb-md">Welcome to Chatbot</h1>
      <p class="text-subtitle1">Select a chat to continue or create a new one</p>
      <q-btn color="primary" label="Create New Chat" @click="createNewChat" class="q-mt-lg" />
    </div>
  </q-page>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import axios from 'axios';
import { useAuthStore } from '@/stores/auth';

const $router = useRouter();
const $q = useQuasar();
const authStore = useAuthStore();

async function createNewChat() {
  try {
    const response = await axios.post('http://127.0.0.1:8000/api/v1/chats', {
      name: 'New Chat',
      user_id: authStore.user.sub,
    });
    $router.push(`/chat/${response.data.id}`);
  } catch (error) {
    $q.notify({
      color: 'negative',
      message: 'Error creating new chat',
      icon: 'error',
    });
  }
}
</script>

