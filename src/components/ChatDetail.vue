<template>
  <div class="d-flex flex-column flex-grow-1 mh-100">
    <!-- Chat Stack -->
    <div class="chat-stack flex-grow-1 py-3 px-5 mh-100 overflow-auto" ref="chatContainer">
      <div v-for="(message, index) in messages" :key="index" class="mb-3">
        <div
          v-if="message.role === 'assistant'"
          class="d-flex justify-content-start text-start"
        >
          <div
            class="bg-secondary text-white px-3 py-2 rounded-end message-box"
            v-html="marked(message.content)"
          ></div>
        </div>
        <div v-else class="d-flex justify-content-end text-start">
          <div
            class="bg-primary text-white px-3 py-2 rounded-start ms-auto message-box"
            v-html="marked(message.content)"
          ></div>
        </div>
      </div>
    </div>

    <!-- Chat Suggestions -->
    <div class="p-3 bg-light border-top">
      <div class="d-flex flex-column">
        <button
          v-for="(suggestion, index) in suggestions"
          :key="index"
          class="btn btn-suggestion mb-2"
          @click="applySuggestion(suggestion)"
        >
          {{ suggestion }}
          <span class="suggestion-arrow">&rarr;</span>
        </button>
      </div>
    </div>

    <!-- Input Field -->
    <div class="border-top p-3 bg-light">
      <div class="input-group">
        <div class="textarea-wrapper">
          <textarea
            v-model="userInput"
            class="form-control custom-textarea"
            placeholder="Type your message (Markdown supported)..."
            rows="1"
            @keydown="handleInputKeydown"
            @input="adjustTextareaHeight"
            ref="chatTextarea"
          ></textarea>
        </div>
        <button class="btn btn-primary" @click="sendMessage">Send</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import axios from "axios";
import { marked } from "marked";
import { camelize } from "@/utils";
import { useRoute } from "vue-router";
import { ref, onMounted, nextTick } from "vue";

const $route = useRoute();

console.log($route.params);

const messages = ref([]);
const suggestions = ref([]);
const userInput = ref("");
const chatTextarea = ref(null);
const textareaLines = ref(1);


function applySuggestion(suggestion) {
  userInput.value = suggestion;
  sendMessage();
}

function handleInputKeydown(event) {
  if (event.key === "Enter" && !event.shiftKey) {
    event.preventDefault();
    sendMessage();
  }
}

function adjustTextareaHeight() {
  if (!chatTextarea.value) return;

  const textarea = chatTextarea.value;
  textarea.style.height = 'auto';

  const scrollHeight = textarea.scrollHeight;
  const lineHeight = 24; // Line height in pixels
  const maxLines = 5;

  const lines = Math.min(Math.floor(scrollHeight / lineHeight), maxLines);
  textareaLines.value = lines;

  if (scrollHeight > maxLines * lineHeight) {
    textarea.style.height = `${maxLines * lineHeight}px`;
  } else {
    textarea.style.height = `${scrollHeight}px`;
  }
}

async function fetchMessages() {
  try {
    const response = await axios.get(`http://127.0.0.1:8000/api/v1/chat/${$route.params.chatId}`);

    messages.value = camelize(response.data);
  } catch (error) {
    console.error("Error fetching messages:", error);
  }
}

async function sendMessage() {
  if (!userInput.value.trim()) return;

  messages.value.push({
    role: "user",
    content: userInput.value,
  });

  const query = userInput.value;
  userInput.value = "";

  // Reset textarea height and lines
  if (chatTextarea.value) {
    chatTextarea.value.style.height = 'auto';
    textareaLines.value = 1;
  }

  // Force recompute chatStackMaxHeight
  textareaLines.value = Math.max(1, textareaLines.value); // Ensures it triggers recompute

  try {
    const response = await axios.post(
      `http://127.0.0.1:8000/api/v1/chat/${$route.params.chatId}`,
      { query: query },
      { headers: { "Content-Type": "application/json" } }
    );

    const botResponse = response.data.content;
    messages.value.push({ role: response.data.role, content: botResponse });
  } catch (error) {
    console.error(error);
    alert("An error occurred while fetching the bot's response.");
  }

  // Scroll to the bottom after sending the message
  nextTick(() => {
    const chatContainer = document.querySelector(".overflow-auto");
    chatContainer.scrollTop = chatContainer.scrollHeight;
  });

  // Fetch chat suggestions after sending the message
  fetchSuggestions();
}

async function fetchSuggestions() {
  try {
    const response = await axios.post(`http://127.0.0.1:8000/api/v1/chat/${$route.params.chatId}/suggestions`);
    suggestions.value = response.data.suggestions;
  } catch (error) {
    console.error("Error fetching suggestions:", error);
  }
}


onMounted(async () => {
  await fetchMessages();
  await fetchSuggestions();

  console.log(messages.value);

  if (messages.value.length === 0) {
    messages.value.push({
      role: "assistant",
      content: "Hi there! How can I help you today?",
    });
  }
});
</script>

<style scoped>
/* Chat stack styling */
.chat-stack {
  transition: max-height 0.05s ease;
}

.message-box {
  max-width: 60vw;
  word-wrap: break-word;
}

.message-box > *:last-child {
  margin-bottom: 0;
}

/* Textarea styling */
.textarea-wrapper {
  position: relative;
  width: 100%;
}

.custom-textarea {
  resize: none;
  overflow-y: auto;
  min-height: 38px; /* Initial height */
  max-height: 120px; /* 5 lines * 24px line height */
  width: 100%;
  line-height: 24px;
  padding-right: 60px; /* Make space for the send button */
}

/* Input group styling */
.input-group {
  position: relative;
}

.input-group .btn {
  position: absolute;
  right: 0;
  bottom: 0;
  height: 100%;
}

/* Navbar styling */
.bg-light {
  background-color: #f8f9fa !important;
}

.border-end {
  border-right: 1px solid #dee2e6 !important;
}

/* Chat suggestions styling */
.btn-suggestion {
  background-color: #f8f9fa;
  border: 1px solid #dee2e6;
  color: #212529;
  text-align: left;
  padding: 5px 15px;
  border-radius: 20px;
  transition: all 0.3s ease;
  position: relative;
}

.btn-suggestion:hover {
  background-color: #e9ecef;
}

.suggestion-arrow {
  position: absolute;
  right: 15px;
  top: 50%;
  transform: translateY(-50%);
}
</style>