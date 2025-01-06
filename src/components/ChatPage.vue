<template>
  <div class="d-flex flex-column vh-100">
    <!-- Navigation Bar -->
    <nav class="navbar navbar-expand-lg navbar-light bg-light border-bottom">
      <div class="container-fluid">
        <a class="navbar-brand" href="#">ChatApp</a>
        <button
          class="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav me-auto mb-2 mb-lg-0">
            <li class="nav-item">
              <a class="nav-link active" aria-current="page" href="#">Chat</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="#">Upload</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="#">Profile</a>
            </li>
          </ul>
          <span class="navbar-text"> Welcome, {{ username }} </span>
        </div>
      </div>
    </nav>

    <div class="d-flex flex-grow-1">
      <!-- Vertical Navbar -->
      <div class="d-flex flex-column bg-light border-end" style="width: 250px">
        <div class="p-3 flex-grow-1">
          <h4>Chat</h4>
          <ul class="list-unstyled mt-4">
            <li class="mb-2">
              <button class="btn btn-outline-primary w-100">
                Conversation 1
              </button>
            </li>
            <li class="mb-2">
              <button class="btn btn-outline-primary w-100">
                Conversation 2
              </button>
            </li>
          </ul>
        </div>
        <div class="p-3">
          <button class="btn btn-danger w-100" @click="logout">Logout</button>
        </div>
      </div>

      <!-- Chat Interface -->
      <div class="d-flex flex-column flex-grow-1">
        <!-- Chat Stack -->
        <div class="chat-stack flex-grow-1 py-3 px-5 overflow-auto" ref="chatContainer" :style="{ maxHeight: chatStackMaxHeight }">
          <div v-for="(message, index) in messages" :key="index" class="mb-3">
            <div
              v-if="message.role === 'assistant'"
              class="d-flex justify-content-start text-start"
            >
              <div
                class="bg-secondary text-white px-3 py-2 rounded-end message-box"
                v-html="message.content"
              ></div>
            </div>
            <div v-else class="d-flex justify-content-end text-start">
              <div
                class="bg-primary text-white px-3 py-2 rounded-start ms-auto message-box"
                v-html="message.content"
              ></div>
            </div>
          </div>
        </div>

        <!-- Chat Suggestions -->
        <div class="p-3 bg-light border-top">
          <div class="d-flex flex-column">
            <button
              v-for="(suggestion, index) in chatSuggestions"
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
    </div>
  </div>
</template>

<script setup>
import { useAuthStore } from "@/stores/auth";
import axios from "axios";
import { marked } from "marked";
import { nextTick, onMounted, ref, computed } from "vue";
import { useRouter } from "vue-router";

const messages = ref([]);
const userInput = ref("");
const $router = useRouter();
const authStore = useAuthStore();
const username = ref("User"); // You can replace this with the actual username from your auth store
const chatTextarea = ref(null);
const textareaLines = ref(1);

const chatSuggestions = ref([
  "Tell me more.",
  "Can you provide an example of how reinforcement learning can be used to generate follow-up questions?",
  "How can conversation analysis be used to determine common patterns for generating follow-up questions?",
  "What are some ways to balance the number of follow-up questions to avoid overwhelming the user?",
]);

function logout() {
  authStore.logout();
  $router.push("/login");
}

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

const chatStackMaxHeight = computed(() => {
  const baseHeight = 337; // Initial max-height value
  const additionalLines = Math.min(textareaLines.value - 1, 4); // Max 4 additional lines
  const heightReduction = additionalLines * 22; // 22px per additional line
  return `calc(100vh - ${baseHeight + heightReduction}px)`;
});


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

async function sendMessage() {
  if (!userInput.value.trim()) return;

  messages.value.push({
    role: "user",
    content: marked(userInput.value),
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
      "http://127.0.0.1:8000/api/v1/chat/test",
      { query: query },
      { headers: { "Content-Type": "application/json" } }
    );

    const botResponse = marked(response.data.content);
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
  try {
    const suggestionsResponse = await axios.post('http://127.0.0.1:8000/suggestions', {
      message: query
    });
    chatSuggestions.value = suggestionsResponse.data.suggestions;
  } catch (error) {
    console.error("Error fetching suggestions:", error);
  }


}


onMounted(() => {
  messages.value.push({
    role: "assistant",
    content: "<p>Hi there! How can I help you today?</p>",
  });
});
</script>

<style scoped>
/* Chat stack styling */
.chat-stack {
  overflow-y: auto;
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