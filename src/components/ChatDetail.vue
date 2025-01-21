<template>
  <q-page class="flex flex-col">
    <q-scroll-area
      ref="chatScrollArea"
      class="col q-px-md scroll-area-transition"
      :style="{
        width: '100%',
        maxWidth: leftDrawerOpen ? 'calc(100vw - 285px)' : '100vw',
        maxHeight: maxHeightScrollArea
      }"
    >
      <div class="chat-messages shadow-up-3" :style="{ width: '100%', display: 'flex', flexDirection: 'column', }">
        <q-chat-message
          v-for="(message, index) in sortedMessages"
          :key="index"
          :name="message.role === 'assistant' ? 'Bot' : 'You'"
          :text="[marked(message.content)]"
          :sent="message.role !== 'assistant'"
          :text-color="message.role === 'assistant' ? 'black' : 'black'"
          :bg-color="message.role === 'assistant' ? 'blue-2' : 'grey-4'"
          :style="{ maxWidth: '80%', alignSelf: message.role === 'assistant' ? 'flex-start' : 'flex-end' }"
          stamp="a few moments ago (placeholder)"
          text-html
        />
      </div>
    </q-scroll-area>

    <q-page-sticky position="bottom" expand class="bg-white" :style="{
      width: '100%',
      maxWidth: leftDrawerOpen ? 'calc(100vw - 280px)' : '100vw',
      transition: 'max-width 0.3s'
      }">
      <q-expansion-item
        v-model="showSuggestions"
        icon="lightbulb"
        label="Suggestions"
        header-class="bg-primary text-white"
        style="width: 100%;"
      >
        <q-card
        :style="{ maxHeight: '88px', overflow: 'auto' }"
        >
          <q-card-section>
            <div class="row q-col-gutter-sm">
              <div v-for="(suggestion, index) in suggestions" :key="index" class="col-auto">
                <q-chip
                  :label="suggestion"
                  :bg-color="'grey-4'"
                  @click="applySuggestion(suggestion)"
                  clickable
                />
              </div>
            </div>
          </q-card-section>
        </q-card>

      </q-expansion-item>

      <q-form @submit="sendMessage" class="q-pa-md" style="width: 100%;">
        <q-input
          v-model="userInput"
          outlined 
          type="textarea"
          placeholder="Type your message (Markdown supported)..."
          :rows="1"
          :max-rows="5"
          @keydown.enter.prevent="sendMessage"
          class="q-mx-md"
          style="width: calc(100% - 32px);"
        >
          <template v-slot:after>
            <q-btn round dense flat icon="send" type="submit" />
          </template>
        </q-input>
      </q-form>
    </q-page-sticky>
  </q-page>
</template>

<script setup>
import axios from 'axios';
import { marked } from 'marked';
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useQuasar } from 'quasar';
import { camelize } from '@/utils';
import { useLayoutStore } from '@/stores/layout';
import { nextTick } from 'vue';

const $route = useRoute();
const $q = useQuasar();
const layoutStore = useLayoutStore();

const messages = ref([]);
const suggestions = ref([]);
const userInput = ref('');
const showSuggestions = ref(false);
const chatScrollArea = ref(null);

const leftDrawerOpen = computed(() => layoutStore.leftDrawerOpen);

const sortedMessages = computed(() =>
  [...messages.value].sort((a, b) => new Date(a.time) - new Date(b.time))
);

const maxHeightScrollArea = computed(() => {
  const textInputHeight = 88; // Adjust according to your actual text input height
  const suggestionHeight = showSuggestions.value ? 136 : 48; // Adjust according to your actual suggestion height
  return `calc(100vh - 50px - ${textInputHeight}px - ${suggestionHeight}px)`;
});

function applySuggestion(suggestion) {
  userInput.value = suggestion;
  sendMessage();
}

async function sendMessage() {
  if (!userInput.value.trim()) return;

  const query = userInput.value;
  userInput.value = '';

  messages.value.push({
    role: 'user',
    content: query,
  });



  try {
    const config = await axios.get("http://localhost:8000/api/v1/config/answer_generation");
    const streaming = config.data.params.stream;

    const response = await fetch(
      `http://127.0.0.1:8000/api/v1/chats/${$route.params.chatId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: query }),
    });

    if (streaming) {
      console.log("Streaming response...");

      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");

      let botResponse = "";
      let done = false;

      messages.value.push({ role: "assistant", content: botResponse });

      while (!done) {
        const { value, done: streamDone } = await reader.read();
        if (streamDone) break;

        botResponse += decoder.decode(value, { stream: true });
        messages.value[messages.value.length - 1].content = botResponse;

        // Optional: Scroll to bottom after each chunk
        scrollToBottom();
      }

      console.log("Streaming completed.");
      console.log(botResponse);

    } else {
      console.log("Non-streaming response received.");

      const responseData = await response.json();
      const botResponse = responseData.content;
      messages.value.push({ role: responseData.role, content: botResponse });
      scrollToBottom();
    }

    fetchSuggestions();
  } catch (error) {
    $q.notify({
      color: 'negative',
      message: 'An error occurred while fetching the bot\'s response.',
      icon: 'error',
    });
  }
}

async function fetchMessages() {
  try {
    const response = await axios.get(
      `http://127.0.0.1:8000/api/v1/chats/${$route.params.chatId}`
    );
    messages.value = camelize(response.data);
    scrollToBottom();
  } catch (error) {
    $q.notify({
      color: 'negative',
      message: 'Error fetching messages',
      icon: 'error',
    });
  }
}

async function fetchSuggestions() {
  try {
    const response = await axios.post(
      `http://127.0.0.1:8000/api/v1/chats/${$route.params.chatId}/suggestions`
    );
    suggestions.value = response.data.suggestions;
  } catch (error) {
    console.error('Error fetching suggestions:', error);
  }
}

function scrollToBottom() {
  nextTick(() => {
    if (chatScrollArea.value) {
      chatScrollArea.value.setScrollPosition('vertical', 99999);
    }
  });
}

function reloadChat() {
  fetchMessages();
  fetchSuggestions();
}

onMounted(() => {
  reloadChat();
  window.addEventListener('chat-changed', (event) => {
    if (event.detail === $route.params.chatId) {
      reloadChat();
    }
  });
});

watch(() => $route.params.chatId, (newChatId, oldChatId) => {
  if (newChatId !== oldChatId) {
    reloadChat();
  }
});

watch(messages, () => {
  if (messages.value.length === 0) {
    messages.value.push({
      role: 'assistant',
      content: 'Hi there! How can I help you today?',
    });
  }
  scrollToBottom();
}, { deep: true });
</script>

<style scoped>
.chat-messages {
  display: flex;
  flex-direction: column;
}

.scroll-area-transition {
  transition: max-height 0.5s ease;
}

</style>
