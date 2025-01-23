<template>
  <q-page class="flex flex-center" :class="{ 'bg-grey-10': $q.dark.isActive }">
    <div class="text-center">
      <h1 class="text-h3 q-mb-md" :class="{ 'text-white': $q.dark.isActive }">Welcome to Chatbot</h1>
      <p class="text-subtitle1" :class="{ 'text-grey-5': $q.dark.isActive }">Enter a message to start a new chat</p>
      <q-form @submit="createNewChat" class="q-pa-md" style="width: 100%; min-width: 800px;" >
        <q-input
          v-model="userInput"
          outlined
          rounded
          autogrow
          type="textarea"
          placeholder="Type your message..."
          :rows="1"
          @keydown="handleKeydown"
          class="q-pa-md input-autogrow"
          :dark="$q.dark.isActive"
        >
          <template v-slot:append>
            <q-btn round flat icon="send" type="submit" />
          </template>
        </q-input>
      </q-form>
    </div>
  </q-page>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import { useAuthStore } from '@/plugins/stores/auth';
import { apiClient } from "@/plugins/api";

const $q = useQuasar();
const $router = useRouter();
const authStore = useAuthStore();
const userInput = ref('');

// eslint-disable-next-line
const $emit = defineEmits(["send"]);

function handleKeydown(event) {
  if (event.key === 'Enter' && !event.shiftKey) {
    // If Enter is pressed without Shift, send the message
    event.preventDefault();  // Prevent the default Enter behavior (form submission)
    createNewChat();
  } else if (event.key === 'Enter' && event.shiftKey) {
    // If Enter is pressed with Shift, allow the input to break the line
    // No action needed, just let the text area handle the line break
  }
}

async function createNewChat() {
  if (!userInput.value.trim()) return;

  try {
    const response = await apiClient.chats.createChat('New Chat', authStore.user.sub);
    const chatId = response.data.id;
    $emit("send");
    // await fetchChats();

    // Redirect to the new chat with the initial message as a query parameter
    $router.push(`/chat/${chatId}?initialMessage=${encodeURIComponent(userInput.value)}`);
  } catch (error) {
    $q.notify({
      color: 'negative',
      message: 'Error creating new chat',
      icon: 'error',
    });
  }
}
</script>
