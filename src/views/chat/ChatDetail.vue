<template>
  <q-page class="flex flex-col">
    <q-scroll-area
      ref="chatScrollArea"
      class="col q-px-md scroll-area-transition"
      content-style="padding-top: 16px; max-width: 100%"
      content-active-style="padding-top: 16px; max-width: 100%"
      :style="{
        maxWidth: '100%',
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
        <template v-if="loading">
          <q-chat-message
            v-for="i in 4"
            :key="i"
            :sent="i % 2 !== 0"
            :bg-color="
              i % 2 === 0
                ? $q.dark.isActive
                  ? 'grey-15'
                  : 'grey-3'
                : $q.dark.isActive
                  ? 'dark-red'
                  : 'light-red'
            "
            :style="{
              width: `calc(${randomWidth(50, 0.8)})`,
              minWidth: '300px',
              alignSelf: i % 2 === 0 ? 'flex-start' : 'flex-end',
              boxShadow: 'none',
            }"
            size="8"
          >
            <template #name>
              <q-skeleton type="QBadge" class="q-mb-sm" />
            </template>
            <template #avatar>
              <q-skeleton type="QAvatar" size="40px" class="q-mx-sm" />
            </template>
            <div class="col-grow">
              <q-skeleton type="text" :width="randomWidth(80)" />
              <q-skeleton type="text" :width="randomWidth(80)" />
              <q-skeleton type="text" :width="randomWidth(80)" />
              <q-skeleton type="text" :width="randomWidth(80, 0.25)" />
              <q-skeleton type="text" width="0%" />
              <q-skeleton type="text" :width="randomWidth(80)" />
              <q-skeleton type="text" :width="randomWidth(80)" />
              <q-skeleton type="text" :width="randomWidth(80, 0.4)" />
            </div>
            <!-- <q-skeleton type="rect" height="8em" class="q-mt-sm" /> -->
          </q-chat-message>
        </template>

        <template v-else>
          <q-chat-message
            v-for="(message, index) in sortedMessages"
            :key="index"
            :name="message.role === 'assistant' ? 'Bot' : authStore.user.firstname"
            :sent="message.role === 'user'"
            :text-color="$q.dark.isActive ? 'white' : 'black'"
            :bg-color="
              message.role === 'assistant'
                ? $q.dark.isActive
                  ? 'grey-15'
                  : 'grey-3'
                : $q.dark.isActive
                  ? 'dark-red'
                  : 'light-red'
            "
            :style="{
              maxWidth: '80%',
              alignSelf: message.role === 'assistant' ? 'flex-start' : 'flex-end',
              boxShadow: 'none',
            }"
            :stamp="parseTime(message.time)"
          >
            <template #avatar>
              <user-avatar v-if="message.role === 'user'" :src="authStore.user.avatar_url" size="40px" class="q-mx-sm" bordered />
              <q-avatar v-else size="40px" class="bordered q-mx-sm">
                <q-img src="@/assets/logo.svg" width="25px" position="0.5px 0.5px" />
              </q-avatar>
            </template>
            <div>
              <template v-for="(part, i) in parseMessage(message.content)" :key="i">
                <v-code-block
                  v-if="part.type === 'code'"
                  :code="part.content"
                  :lang="part.lang"
                  :theme="$q.dark.isActive ? 'github-dark-dimmed' : 'github'"
                />
                <div v-else v-html="marked(part.content)"></div>
              </template>
            </div>
          </q-chat-message>
        </template>

        <q-chat-message
          v-if="waiting"
          :text-color="$q.dark.isActive ? 'white' : 'black'"
          :bg-color="$q.dark.isActive ? 'grey-15' : 'grey-3'"
          :style="{
            maxWidth: '80%',
            alignSelf: 'flex-start',
            boxShadow: 'none',
          }"
          name="Bot"
        >
          <template #default>
            <q-spinner-dots size="2rem" />
          </template>
          <template #avatar>
            <q-avatar size="40px" class="bordered q-mx-sm">
              <q-img src="@/assets/logo.svg" width="25px" position="0.5px 0.5px" />
            </q-avatar>
          </template>
        </q-chat-message>
      </div>
    </q-scroll-area>

    <q-page-sticky
      ref="chatSticky"
      position="bottom"
      expand
      :style="{
        maxWidth: '100%',
        justifyContent: 'end',
      }"
    >
      <q-page-scroller reverse position="bottom" :scroll-offset="20" :offset="[0, 18]">
        <q-btn fab icon="keyboard_arrow_down" color="primary" />
      </q-page-scroller>

      <q-fab icon="lightbulb" color="primary" class="q-mx-md" direction="left" unelevated>
        <q-card
          :style="{
            width: `calc(${chatStickyWidth} - 100px)`,
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
                  class="bg-shadow"
                  @click="applySuggestion(suggestion)"
                  clickable
                />
              </div>
            </div>
          </q-card-section>
        </q-card>
      </q-fab>

      <q-form class="q-pa-md" style="width: 100%">
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
import { apiClient } from '@/plugins/api'
import { useAuthStore } from '@/plugins/stores/auth'
import { camelize } from '@/utils'
import { marked } from 'marked'
import { date, useQuasar } from 'quasar'
import { useRoute, useRouter } from 'vue-router'
import { ref, watch, computed, nextTick, onMounted, onBeforeUnmount, useTemplateRef } from 'vue'
import { VCodeBlock } from '@wdns/vue-code-block'
import ChatInput from '@/components/ChatInput.vue'
import UserAvatar from '@/components/UserAvatar.vue'

const $q = useQuasar()
const $route = useRoute()
const $router = useRouter()
const authStore = useAuthStore()
const chatStickyRef = useTemplateRef('chatSticky')
const chatInputRef = useTemplateRef('chatInput')

const emit = defineEmits(['send', 'rename'])

const messages = ref([])
const suggestions = ref([])
const userInput = ref('')
const waiting = ref(false)
const chatScrollArea = ref(null)
const maxHeightScrollArea = ref('calc(100vh - 50px - 88px)')
const chatStickyWidth = ref('100vw')
const loading = ref(true)

const sortedMessages = computed(() =>
  [...messages.value].sort((a, b) => new Date(a.time) - new Date(b.time)),
)

const renderer = {
  link: ({ href, title, text }) => `<a href="${href}" title="${title}" class="link" target="_blank">${text}</a>`,

  heading: ({ tokens, depth: level }) => {
    const text = tokens.map((token) => token.text).join('')
    const newLevel = level <= 3 ? level + 3 : level
    return `<h${level} class="q-mb-sm text-h${newLevel}">${text}</h${level}>`
  },

  codespan: ({ text }) => {
    console.log('Code block:', text)
    return `<code class="bg-shadow q-px-xs rounded-borders">${text}</code>`
  },
}
marked.use({ renderer })
console.log(marked('Hello, [World](https://example.com "Title for Tooltip")!'))

onMounted(() => {
  // Check for initialMessage in the route query and send it if present
  const initialMessage = $route.query.initialMessage

  if (initialMessage) {
    console.log('Initial message:', initialMessage)
    loading.value = false
    sendMessage(initialMessage).then(() => {
      // console.log('Renaming chat...')
      emit('rename', $route.params.chatId)
    })
    // sendMessage(decodeURIComponent(initialMessage))
    // Remove the initialMessage from the query parameters
    $router.replace({ query: {} })
  } else {
    reloadChat()
  }

  updateStickyWidth()
  window.addEventListener('resize', updateStickyWidth)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', updateStickyWidth)
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

function reloadChat() {
  fetchMessages()
  fetchSuggestions()
}

function updateStickyWidth() {
  if (chatStickyRef.value) {
    chatStickyWidth.value = `${chatStickyRef.value.$el.getBoundingClientRect().width}px`
    // console.log('Sticky width:', chatStickyWidth.value)
  }
}

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

    scrollToBottom(true)

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
    }

    emit('send')
    scrollToBottom(true)
    fetchSuggestions()
  } catch (error) {
    console.error('Error sending message:', error)
    $q.notify({
      type: 'negative',
      message: "An error occurred while fetching the bot's response.",
    })
  }
}

async function fetchMessages() {
  try {
    console.log('Fetching messages...')
    loading.value = true
    const response = await apiClient.chats.listMessages($route.params.chatId)
    messages.value = camelize(response.data)
    scrollToBottom(true)
  } catch (error) {
    if (error.status === 404 || error.status === 403) {
      console.log('Chat not found. Redirecting to chat start...')
      $router.push({ name: 'chat-start' })
    } else {
      console.error('Error fetching messages:', error)
      $q.notify({
        type: 'negative',
        message: 'Error fetching messages',
      })
    }
  } finally {
    loading.value = false
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

function scrollToBottom(force = false) {
  nextTick(() => {
    if (chatScrollArea.value && (force || chatScrollArea.value.getScroll().verticalPercentage > 0.9)) {
      console.log('Scrolling to bottom...')
      chatScrollArea.value.setScrollPercentage('vertical', 1, 300)
    }
  })
}

function randomWidth(bias = 75, weight = 1) {
  return Math.floor(Math.random() * (100 - bias) + bias) * weight + '%'
}

function parseMessage(content) {
  const tokens = marked.lexer(content); // Tokenize the Markdown content
  let parts = [];
  // console.log('Parsing message:', content)
  console.log('Tokens:', tokens)

  tokens.forEach((token) => {
    if (token.type === "code") {
      parts.push({
        type: "code",
        lang: token.lang || "plaintext", // Default to plaintext if no language is detected
        content: token.text,
      });
    } else {
      parts.push({ type: "text", content: token.raw });
    }
  });

  return parts;
}
</script>

<style lang="scss" scoped>
.scroll-area-transition {
  transition: max-height 0.8s ease-in-out;
}
</style>

<style lang="scss">
.q-message-container {
  > div:not(.q-avatar) {
    max-width: 100%;
  }
}

.q-message-text {
  padding: 12px;
}

.q-message-name--sent {
  justify-self: flex-end;
}

.q-message-text a {
  color: $primary;
}

.q-message-text :not(li) > {
  ul, ol {
    margin-top: -8px;
  }
}

.body--dark {
  .q-message-text a {
    color: $link;
  }
}
</style>
