<template>
  <div class="d-flex vh-100">
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
    <div class="d-flex flex-column flex-grow-1 justify-content-between">
      <!-- Chat Stack -->
      <div class="flex-grow-1 overflow-auto p-3" ref="chatContainer">
        <div v-for="(message, index) in messages" :key="index" class="mb-3">
          <div
            v-if="message.sender === 'bot'"
            class="d-flex justify-content-start text-start"
          >
            <div
              class="bg-secondary text-white p-2 rounded-end"
              v-html="message.text"
            ></div>
          </div>
          <div v-else class="d-flex justify-content-end">
            <div class="bg-primary text-white p-2 rounded-start">
              {{ message.text }}
            </div>
          </div>
        </div>
      </div>

      <!-- Input Field -->
      <div class="border-top p-3 bg-light">
        <div class="input-group">
          <input
            v-model="userInput"
            type="text"
            class="form-control"
            placeholder="Type your message..."
            @keydown.enter="sendMessage"
          />
          <button class="btn btn-primary" @click="sendMessage">Send</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useAuthStore } from "@/stores/auth";
import axios from "axios";
import { marked } from "marked";
import { nextTick, onMounted, ref } from "vue";
import { useRouter } from "vue-router";

const messages = ref([]);
const userInput = ref("");
const $router = useRouter();
const authStore = useAuthStore();

function logout() {
  authStore.logout();
  $router.push("/login");
}

async function sendMessage() {
  if (!userInput.value.trim()) return;

  // Add user's message to the chat stack
  messages.value.push({ sender: "user", text: userInput.value });

  const query = userInput.value;
  // Clear the input field
  userInput.value = "";

  // Fetch a bot response from mock data
  try {
    const response = await axios.get("http://127.0.0.1:8000/generate-answer", {
      params: { query: query },
    });

    console.log("Response:", response.data); // Log the response

    // Add bot's response to the chat stack
    const botResponse = marked(response.data.answer.choices[0].message.content);
    messages.value.push({ sender: "bot", text: botResponse });
  } catch (error) {
    alert("An error occurred while fetching the bot's response.");
    console.error(error);
  }

  // Scroll to the bottom of the chat
  nextTick(() => {
    const chatContainer = document.querySelector(".overflow-auto");
    chatContainer.scrollTop = chatContainer.scrollHeight;
  });
}

// Preload a sample conversation
onMounted(() => {
  messages.value.push({
    sender: "bot",
    text: "Hi there! How can I help you today?",
  });
});
</script>

<style scoped>
/* Navbar styling */
.bg-light {
  background-color: #f8f9fa !important;
}

.border-end {
  border-right: 1px solid #dee2e6 !important;
}

/* Chat styling */
.overflow-auto {
  max-height: 80%;
  overflow-y: auto;
}

input::placeholder {
  color: #adb5bd;
}

input:focus,
button:focus {
  outline: none;
  box-shadow: none !important;
}
</style>
