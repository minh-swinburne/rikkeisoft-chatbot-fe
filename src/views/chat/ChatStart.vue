<template>
  <q-page class="flex flex-center">
    <div class="text-center" style="width: 100%">
      <h1 class="text-h3 q-mb-md q-mx-md" :class="{ 'text-white': $q.dark.isActive }">
        Welcome to RikkeiGPT
      </h1>
      <p class="text-subtitle1" :class="{ 'text-grey-5': $q.dark.isActive }">
        Enter a message to start a new chat
      </p>
      <q-form class="q-pa-md" style="width: 60%; min-width: 300px; margin: auto">
        <chat-input v-model="userInput" @send="startChat" />
      </q-form>
    </div>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import { useQuasar } from 'quasar'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/plugins/stores/auth'
import { apiClient } from '@/plugins/api'
import ChatInput from '@/components/ChatInput.vue'

const $q = useQuasar()
const $router = useRouter()
const authStore = useAuthStore()
const userInput = ref('')

const emit = defineEmits(['send'])

async function startChat() {
  if (!userInput.value.trim()) return

  try {
    const response = await apiClient.chats.createChat('New Chat', authStore.user.sub)
    const chatId = response.data.id
    emit('send')
    // await fetchChats();

    // Redirect to the new chat with the initial message as a query parameter
    $router.push({ name: 'chat-detail', params: { chatId }, query: { initialMessage: userInput.value } })
    // $router.push(`/chat/${chatId}?initialMessage=${encodeURIComponent(userInput.value)}`)
  } catch (error) {
    console.error('Error creating new chat:', error)
    $q.notify({
      color: 'negative',
      message: 'Error creating new chat',
      icon: 'error',
    })
  }
}
</script>
