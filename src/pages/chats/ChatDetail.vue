<template>
  <q-page class="flex flex-col" :class="{ 'bg-grey-10': $q.dark.isActive }">
    <q-scroll-area
      ref="chatScrollArea"
      class="col q-px-xl scroll-area-transition"
      :style="{
        maxWidth: leftDrawerOpen ? 'calc(100vw - 285px)' : '100vw',
        maxHeight: maxHeightScrollArea,
        boxShadow: 'none',
        transition: 'max-width 0.1s ease',
      }"
    >
      <div
        class="chat-messages shadow-up-3"
        :style="{
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: 'none',
        }"
      >
        <q-chat-message
          v-for="(message, index) in sortedMessages"
          :key="index"
          :name="
            message.role === 'assistant' ? 'Bot' : authStore.user?.firstname
          "
          :text="[marked(message.content)]"
          :sent="message.role !== 'assistant'"
          :text-color="$q.dark.isActive ? 'white' : 'black'"
          :bg-color="
            message.role === 'assistant'
              ? $q.dark.isActive
                ? 'dark-red'
                : 'red-2'
              : $q.dark.isActive
              ? 'grey-9'
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
      <q-fab icon="lightbulb" color="primary" class="q-mx-md" direction="left">
        <q-card
          :style="{
            width: leftDrawerOpen
              ? 'calc(100vw - 380px)'
              : 'calc(100vw - 100px)',
            alignSelf: 'flex-end',
          }"
          class="no-shadow"
          bordered
        >
          <q-card-section class="q-pa-sm">
            <div class="row q-col-gutter-sm">
              <div
                v-for="(suggestion, index) in suggestions"
                :key="index"
                class="col-auto"
              >
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

      <q-form @submit="sendMessage()" class="q-pa-md" style="width: 100%">
        <q-input
          v-model="userInput"
          outlined
          rounded
          autogrow
          type="textarea"
          placeholder="Type your message (Markdown supported)..."
          :rows="1"
          :max-rows="1"
          @keydown="handleKeydown"
          class="q-mx-md"
          :style="{ width: 'calc(100% - 32px)' }"
          :dark="$q.dark.isActive"
        >
          <template v-slot:append>
            <q-btn round flat icon="send" type="submit" />
          </template>
        </q-input>
      </q-form>
    </q-page-sticky>
  </q-page>
</template>

<script setup>
import { apiClient } from "@/plugins/api";
import { useAuthStore } from "@/plugins/stores/auth";
import { useLayoutStore } from "@/plugins/stores/layout";
import { camelize } from "@/utils";
import { marked } from "marked";
import { date, useQuasar } from "quasar";
import { computed, nextTick, onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";

const $q = useQuasar();
const $route = useRoute();
const $router = useRouter();
const authStore = useAuthStore();
const layoutStore = useLayoutStore();

// eslint-disable-next-line
const emit = defineEmits(["send", "rename"]);

const messages = ref([]);
const suggestions = ref([]);
const userInput = ref("");
const chatScrollArea = ref(null);

const leftDrawerOpen = computed(() => layoutStore.leftDrawerOpen);

const sortedMessages = computed(() =>
  [...messages.value].sort((a, b) => new Date(a.time) - new Date(b.time))
);

const maxHeightScrollArea = computed(() => {
  const textInputHeight = 88; // Adjust according to your actual text input height
  return `calc(100vh - 50px - ${textInputHeight}px)`;
});

function handleKeydown(event) {
  if (event.key === "Enter" && !event.shiftKey) {
    // If Enter is pressed without Shift, send the message
    event.preventDefault(); // Prevent the default Enter behavior (form submission)
    sendMessage();
  }
}

function applySuggestion(suggestion) {
  userInput.value = suggestion;
  sendMessage();
}

function parseTime(time) {
  const now = new Date();
  const sameYear = date.isSameDate(time, now, "year");
  // const sameDate = date.isSameDate(time, now, "date");
  // const sameHour = date.isSameDate(time, now, "hour");

  let timeString = "";

  // if (sameHour) {
  //   timeString = date.formatDate(time, "m") + "minutes ago";
  // } else if (sameDate) {
  //   timeString = date.formatDate(time, "H") + "hours ago";
  // } else {
  if (sameYear) {
    timeString = date.formatDate(time, "MMM Do");
  } else {
    timeString = date.formatDate(time, "DD/MM/YYYY");
  }
  timeString += ", " + date.formatDate(time, "hh:mm A");
  // }
  return timeString;
}

async function sendMessage(initialMessage = null) {
  const query = initialMessage || userInput.value.trim();
  if (!query) return;

  if (!initialMessage) {
    userInput.value = "";
  }

  messages.value.push({
    role: "user",
    content: query,
    time: new Date().toISOString(),
  });

  try {
    const confResponse = await apiClient.config.checkStream(
      "answer_generation"
    );
    const streaming = confResponse.data;

    const chatResponse = await apiClient.chats.sendMessage(
      $route.params.chatId,
      query
    );

    if (streaming) {
      console.log("Streaming response...");

      const reader = chatResponse.body.getReader();
      const decoder = new TextDecoder("utf-8");

      let botResponse = "";
      let done = false;

      messages.value.push({
        role: "assistant",
        content: botResponse,
        time: new Date().toISOString(),
      });

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

      const responseData = await chatResponse.json();
      const botResponse = responseData.content;
      messages.value.push({ role: responseData.role, content: botResponse });
      scrollToBottom();
    }

    if (messages.value.length === 2) {
      emit("rename", $route.params.chatId);
    }
    emit("send");

    fetchSuggestions();
  } catch (error) {
    console.error("Error sending message:", error);
    $q.notify({
      color: "negative",
      message: "An error occurred while fetching the bot's response.",
      icon: "error",
    });
  }
}

async function fetchMessages() {
  try {
    console.log("Fetching messages...");
    const response = await apiClient.chats.listMessages($route.params.chatId);
    messages.value = camelize(response.data);
    scrollToBottom();
  } catch (error) {
    $q.notify({
      color: "negative",
      message: "Error fetching messages",
      icon: "error",
    });
  }
}

async function fetchSuggestions() {
  try {
    const response = await apiClient.chats.getSuggestions($route.params.chatId);
    suggestions.value = response.data.suggestions;
  } catch (error) {
    console.error("Error fetching suggestions:", error);
  }
}

function scrollToBottom() {
  nextTick(() => {
    if (chatScrollArea.value) {
      chatScrollArea.value.setScrollPosition("vertical", 99999);
    }
  });
}

function reloadChat() {
  fetchMessages();
  fetchSuggestions();
}

onMounted(() => {
  window.addEventListener("chat-changed", (event) => {
    if (event.detail === $route.params.chatId) {
      console.log("hehehe");
      reloadChat();
    }
  });

  // Check for initialMessage in the route query and send it if present
  const initialMessage = $route.query.initialMessage;
  if (initialMessage) {
    sendMessage(decodeURIComponent(initialMessage));
    // Remove the initialMessage from the query parameters
    $router.replace({ query: {} });
  } else {
    reloadChat();
  }
});

watch(
  () => $route.params.chatId,
  (newChatId, oldChatId) => {
    if (newChatId !== oldChatId) {
      console.log("hahaha");
      reloadChat();
    }
  }
);
</script>

<style scoped>
.chat-messages {
  display: flex;
  flex-direction: column;
}

.scroll-area-transition {
  transition: max-height 0.8s ease-in-out;
}
</style>
