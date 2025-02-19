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

    <div class="column absolute-bottom-right q-ma-md tw:gap-3">
      <q-fab
        icon="smart_toy"
        color="primary"
        direction="up"
        vertical-actions-align="right"
        unelevated
      >
        <q-list class="tw:rounded-md" style="width: 250px">
          <q-item
            v-for="(chat, type) in chatTypes"
            :key="type"
            :active="chatType === type"
            active-class="bg-shadow-2 tw:text-inherit!"
            class="q-ma-sm q-pa-sm tw:rounded-md"
            clickable
            @click="setChatType(type)"
          >
            <q-item-section avatar>
              <q-avatar :icon="chat.icon" />
            </q-item-section>
            <q-item-section>
              <q-item-label>{{ chat.name }}</q-item-label>
              <q-item-label caption>{{ chat.desc }}</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-fab>
    </div>
  </q-page>
</template>

<script setup>
import ChatInput from '@/components/ChatInput.vue'
import { apiClient } from '@/plugins/api'
import { useAuthStore } from '@/plugins/stores/auth'
import { useQuasar } from 'quasar'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const $q = useQuasar()
const $router = useRouter()
const authStore = useAuthStore()

const userInput = ref('')
const chatType = ref('general')
const chatTypes = {
  general: { name: 'General Chatbot', icon: 'chat', desc: 'For general purposes' },
  coder: { name: 'Coder Chatbot', icon: 'code', desc: 'Helps with coding' },
  docs: { name: 'Document Chatbot', icon: 'description', desc: 'Finds info from documents' },
}

const emit = defineEmits(['send'])

function setChatType(model) {
  chatType.value = model
  // console.log('Selected chat type:', model)
}

async function startChat() {
  if (!userInput.value.trim()) return

  try {
    const response = await apiClient.chats.createChat('New Chat', authStore.user.sub)
    const chatId = response.data.id
    emit('send')
    // await fetchChats();

    // Redirect to the new chat with the initial message as a query parameter
    $router.push({
      name: 'chat-detail',
      params: { chatId },
      query: { initialMessage: userInput.value, initialChatType: chatType.value },
    })
    // $router.push(`/chat/${chatId}?initialMessage=${encodeURIComponent(userInput.value)}`)
  } catch (error) {
    console.error('Error creating new chat:', error)
    $q.notify({
      type: 'negative',
      message: 'Error creating new chat',
    })
  }
}
</script>
