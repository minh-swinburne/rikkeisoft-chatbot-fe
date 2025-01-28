<template>
  <q-page class="flex flex-col" :class="{ 'bg-grey-16': $q.dark.isActive }">
    <q-scroll-area
      ref="chatScrollArea"
      class="col q-px-xl scroll-area-transition"
      :style="{
        maxWidth: leftDrawerOpen ? 'calc(100vw - 285px)' : '100vw',
        maxHeight: maxHeightScrollArea,
        transition: 'max-width 0.1s ease',
      }"
    >
      <div
        :style="{
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
        }"
      >
        <q-chat-message
          v-for="(message, index) in sortedMessages"
          :key="index"
          :name="message.role === 'assistant' ? 'Bot' : authStore.user?.firstname"
          :text="[marked(message.content)]"
          :sent="message.role !== 'assistant'"
          :text-color="$q.dark.isActive ? 'white' : 'black'"
          :bg-color="
            message.role === 'assistant'
              ? $q.dark.isActive
                ? 'dark-red'
                : 'light-red'
              : $q.dark.isActive
                ? 'grey-15'
                : 'grey-3'
          "
          :style="{
            maxWidth: '80%',
            alignSelf: message.role === 'assistant' ? 'flex-start' : 'flex-end',
            boxShadow: 'none',
            padding: '0 16px',
          }"
          :stamp="parseTime(message.time)"
          text-html
        />

        <q-chat-message
          v-if="waiting"
          :text-color="$q.dark.isActive ? 'white' : 'black'"
          :bg-color="$q.dark.isActive ? 'dark-red' : 'light-red'"
          :style="{
            maxWidth: '80%',
            alignSelf: 'flex-start',
            boxShadow: 'none',
            padding: '0 16px',
          }"
          name="Bot"
        >
          <q-spinner-dots size="2rem" />
        </q-chat-message>
      </div>
    </q-scroll-area>

    <q-page-sticky
      position="bottom"
      expand
      :style="{
        width: '100%',
        maxWidth: leftDrawerOpen ? 'calc(100vw - 280px)' : '100vw',
        justifyContent: 'end',
      }"
    >
      <q-page-scroller reverse position="bottom" :scroll-offset="20" :offset="[0, 18]">
        <q-btn fab icon="keyboard_arrow_down" color="primary" />
      </q-page-scroller>

      <q-fab icon="lightbulb" color="primary" class="q-mx-md" direction="left">
        <q-card
          :style="{
            width: leftDrawerOpen ? 'calc(100vw - 380px)' : 'calc(100vw - 100px)',
            alignSelf: 'flex-end',
          }"
          class="no-shadow"
          bordered
        >
          <q-card-section class="q-pa-sm">
            <div class="row q-col-gutter-sm">
              <div v-for="(suggestion, index) in suggestions" :key="index" class="col-auto">
                <q-chip
                  :label="suggestion"
                  :color="$q.dark.isActive ? 'grey-9' : 'grey-3'"
                  @click="applySuggestion(suggestion)"
                  clickable
                />
              </div>
            </div>
          </q-card-section>
        </q-card>
      </q-fab>

      <q-form :class="{ 'bg-grey-16': $q.dark.isActive }" class="q-pa-md" style="width: 100%">
        <chat-input
          ref="chatInput"
          v-model="userInput"
          :style="{ width: 'calc(100% - 32px)' }"
          class="q-mx-md"
          @update:model-value="updateScrollArea"
          @send="sendMessage(userInput)"
        />
      </q-form>
    </q-page-sticky>
  </q-page>
</template>

<script setup>
import ChatInput from '@/components/ChatInput.vue'
import { apiClient } from '@/plugins/api'
import { useAuthStore } from '@/plugins/stores/auth'
import { useLayoutStore } from '@/plugins/stores/layout'
import { camelize } from '@/utils'
import { marked } from 'marked'
import { date, useQuasar } from 'quasar'
import { computed, nextTick, onMounted, ref, useTemplateRef, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const $q = useQuasar()
const $route = useRoute()
const $router = useRouter()
const authStore = useAuthStore()
const layoutStore = useLayoutStore()
const chatInputRef = useTemplateRef('chatInput')

const emit = defineEmits(['send', 'rename'])

const messages = ref([])
const suggestions = ref([])
const userInput = ref('')
const waiting = ref(false)
const chatScrollArea = ref(null)
const maxHeightScrollArea = ref('calc(100vh - 50px - 88px)')

const leftDrawerOpen = computed(() => layoutStore.leftDrawerOpen && $q.screen.gt.sm)

const sortedMessages = computed(() =>
  [...messages.value].sort((a, b) => new Date(a.time) - new Date(b.time)),
)

function updateScrollArea() {
  // Add a small delay to allow the input to update its height
  setTimeout(() => {
    const padding = 32
    const textInputHeight = chatInputRef.value
      ? parseInt(getComputedStyle(chatInputRef.value.$el).height)
      : 56

    maxHeightScrollArea.value = `calc(100vh - 50px - ${textInputHeight + padding}px)`
  }, 50)
}

function applySuggestion(suggestion) {
  sendMessage(suggestion)
}

function parseTime(time) {
  const now = new Date()
  const sameYear = date.isSameDate(time, now, 'year')
  // const sameDate = date.isSameDate(time, now, "date");
  // const sameHour = date.isSameDate(time, now, "hour");

  let timeString = ''

  // if (sameHour) {
  //   timeString = date.formatDate(time, "m") + "minutes ago";
  // } else if (sameDate) {
  //   timeString = date.formatDate(time, "H") + "hours ago";
  // } else {
  if (sameYear) {
    timeString = date.formatDate(time, 'MMM Do')
  } else {
    timeString = date.formatDate(time, 'DD/MM/YYYY')
  }
  timeString += ', ' + date.formatDate(time, 'hh:mm A')
  // }
  return timeString
}

async function sendMessage(query) {
  if (!query) return
  console.log('Sending message:', query)

  messages.value.push({
    role: 'user',
    content: query,
    time: new Date().toISOString(),
  })

  userInput.value = ''
  waiting.value = true

  try {
    const confResponse = await apiClient.config.checkStream('answer_generation')
    const streaming = confResponse.data
    const chatResponse = await apiClient.chats.sendMessage($route.params.chatId, query)

    if (streaming) {
      console.log('Streaming response...')

      const reader = chatResponse.body.getReader()
      const decoder = new TextDecoder('utf-8')

      let botResponse = ''
      let done = false

      waiting.value = false
      messages.value.push({
        role: 'assistant',
        content: botResponse,
        time: new Date().toISOString(),
      })

      while (!done) {
        const { value, done: streamDone } = await reader.read()
        if (streamDone) break

        botResponse += decoder.decode(value, { stream: true })
        messages.value[messages.value.length - 1].content = botResponse

        // Optional: Scroll to bottom after each chunk
        scrollToBottom()
      }

      console.log('Streaming completed. Bot response:', botResponse)
    } else {
      console.log('Non-streaming response received.')
      const responseData = await chatResponse.json()
      const botResponse = responseData.content

      waiting.value = false
      messages.value.push({ role: responseData.role, content: botResponse })
      scrollToBottom()
    }

    if (messages.value.length === 2) {
      emit('rename', $route.params.chatId)
    }

    emit('send')
    fetchSuggestions()
  } catch (error) {
    console.error('Error sending message:', error)
    $q.notify({
      color: 'negative',
      message: "An error occurred while fetching the bot's response.",
      icon: 'error',
    })
  }
}

async function fetchMessages() {
  try {
    console.log('Fetching messages...')
    const response = await apiClient.chats.listMessages($route.params.chatId)
    messages.value = camelize(response.data)
    scrollToBottom()
  } catch (error) {
    console.error('Error fetching messages:', error)
    $q.notify({
      color: 'negative',
      message: 'Error fetching messages',
      icon: 'error',
    })
  }
}

async function fetchSuggestions() {
  try {
    const response = await apiClient.chats.getSuggestions($route.params.chatId)
    suggestions.value = response.data.suggestions
  } catch (error) {
    console.error('Error fetching suggestions:', error)
  }
}

function scrollToBottom() {
  nextTick(() => {
    if (chatScrollArea.value) {
      chatScrollArea.value.setScrollPosition('vertical', 99999)
    }
  })
}

function reloadChat() {
  fetchMessages()
  fetchSuggestions()
}

onMounted(() => {
  window.addEventListener('chat-changed', (event) => {
    if (event.detail === $route.params.chatId) {
      console.log('hehehe chat changed')
      reloadChat()
    }
  })

  // Check for initialMessage in the route query and send it if present
  const initialMessage = $route.query.initialMessage
  if (initialMessage) {
    sendMessage(decodeURIComponent(initialMessage))
    // Remove the initialMessage from the query parameters
    $router.replace({ query: {} })
  } else {
    reloadChat()
  }
})

watch(
  () => $route.params.chatId,
  (newChatId, oldChatId) => {
    if (newChatId !== oldChatId) {
      console.log('hahaha')
      reloadChat()
    }
  },
)
</script>

<style scoped>
.scroll-area-transition {
  transition: max-height 0.8s ease-in-out;
}
</style>

<style lang="scss"></style>
