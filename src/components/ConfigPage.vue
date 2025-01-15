<template>
  <nav-bar></nav-bar>

  <div class="main-container">
    <div class="tabs">
      <button
        class="btn btn-primary"
        :class="{ active: activeTab === 'answer-generation' }"
        @click="activeTab = 'answer-generation'">
        Answer Generation
      </button>
      <button
        class="btn btn-primary"
        :class="{ active: activeTab === 'question-suggestion' }"
        @click="activeTab = 'question-suggestion'">
        Question Suggestion
      </button>
      <button
        class="btn btn-primary"
        :class="{ active: activeTab === 'chat-name-generation' }"
        @click="activeTab = 'chat-name-generation'">
        Chat Name Generation
      </button>
    </div>

    <div class="tab-content">
      <!-- Answer Generation Tab -->
      <div v-if="activeTab === 'answer-generation'">
        <h2>Answer Generation</h2>
        <form @submit.prevent="handleSubmit('answer-generation')">
          <div class="input-container">
            <label for="instructions-answer">Instructions:</label>
            <textarea
              id="instructions-answer"
              v-model="formData.instructions"
              rows="5"
              placeholder="Enter your instructions here..."
            ></textarea>
          </div>
          <div class="input-container">
            <label for="temperature-answer">Temperature:</label>
            <input
              id="temperature-answer"
              v-model="formData.temperature"
              type="number"
              step="0.1"
              min="0"
              max="1"
              placeholder="Enter temperature (0-1)"
            />
          </div>
          <div class="input-container">
            <label for="max-tokens-answer">Max Tokens:</label>
            <input
              id="max-tokens-answer"
              v-model="formData.maxTokens"
              type="number"
              min="1"
              placeholder="Enter max tokens"
            />
          </div>
          <div class="input-container">
            <label for="ai-model-answer">AI Model:</label>
            <select id="ai-model-answer" v-model="formData.aiModel">
              <option value="llama-3.3-70b-versatile">Llama 3.3 - 70B Versatile</option>
              <option value="llama-3.2-1b-preview">Llama 3.2 - 1B Preview</option>
            </select>
          </div>
          <button type="submit" class="btn btn-danger">Apply</button>
        </form>
      </div>

      <!-- Question Suggestion Tab -->
      <div v-if="activeTab === 'question-suggestion'">
        <h2>Question Suggestion</h2>
        <form @submit.prevent="handleSubmit('question-suggestion')">
          <div class="input-container">
            <label for="instructions-question">Instructions:</label>
            <textarea
              id="instructions-question"
              v-model="formData.instructions"
              rows="5"
              placeholder="Enter your instructions here..."
            ></textarea>
          </div>
          <div class="input-container">
            <label for="temperature-question">Temperature:</label>
            <input
              id="temperature-question"
              v-model="formData.temperature"
              type="number"
              step="0.1"
              min="0"
              max="1"
              placeholder="Enter temperature (0-1)"
            />
          </div>
          <div class="input-container">
            <label for="max-tokens-question">Max Tokens:</label>
            <input
              id="max-tokens-question"
              v-model="formData.maxTokens"
              type="number"
              min="1"
              placeholder="Enter max tokens"
            />
          </div>
          <div class="input-container">
            <label for="ai-model-question">AI Model:</label>
            <select id="ai-model-question" v-model="formData.aiModel">
              <option value="llama-3.3-70b-versatile">Llama 3.3 - 70B Versatile</option>
              <option value="llama-3.2-1b-preview">Llama 3.2 - 1B Preview</option>
            </select>
          </div>
          <button type="submit" class="btn btn-danger">Apply</button>
        </form>
      </div>

      <!-- Chat Name Generation Tab -->
      <div v-if="activeTab === 'chat-name-generation'">
        <h2>Chat Name Generation</h2>
        <form @submit.prevent="handleSubmit('chat-name-generation')">
          <div class="input-container">
            <label for="instructions-chat-name">Instructions:</label>
            <textarea
              id="instructions-chat-name"
              v-model="formData.instructions"
              rows="5"
              placeholder="Enter your instructions here..."
            ></textarea>
          </div>
          <div class="input-container">
            <label for="temperature-chat-name">Temperature:</label>
            <input
              id="temperature-chat-name"
              v-model="formData.temperature"
              type="number"
              step="0.1"
              min="0"
              max="1"
              placeholder="Enter temperature (0-1)"
            />
          </div>
          <div class="input-container">
            <label for="max-tokens-chat-name">Max Tokens:</label>
            <input
              id="max-tokens-chat-name"
              v-model="formData.maxTokens"
              type="number"
              min="1"
              placeholder="Enter max tokens"
            />
          </div>
          <div class="input-container">
            <label for="ai-model-chat-name">AI Model:</label>
            <select id="ai-model-chat-name" v-model="formData.aiModel">
              <option value="llama-3.3-70b-versatile">Llama 3.3 - 70B Versatile</option>
              <option value="llama-3.2-1b-preview">Llama 3.2 - 1B Preview</option>
            </select>
          </div>
          <button type="submit" class="btn btn-danger">Apply</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import NavBar from './NavBar.vue';

const activeTab = ref('answer-generation'); // Default active tab
const formData = ref({
  instructions: '',
  temperature: '',
  maxTokens: '',
  aiModel: 'llama-3.3-70b-versatile' // Default AI model
});

const handleSubmit = (tab) => {
  console.log(`Form submitted for ${tab}:`, formData.value);
  // Add your form submission logic here based on the active tab
};
</script>

<style scoped>
.main-container {
  max-width: 800px;
  margin: 2rem auto;
  padding: 2rem;
  background-color: #f8f9fa;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.tabs {
  display: flex;
  justify-content: space-around;
  margin-bottom: 1rem;
}

.tabs button {
  padding: 0.5rem 1rem;
  color: #007bff;
  background-color: #e9ecef;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.tabs button.active {
  background-color: #007bff;
  color: white;
}

.tabs button:hover:not(.active) {
  background-color: #dee2e6;
}

.tab-content {
  background-color: #ffffff;
  border-radius: 8px;
  padding: 1rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.input-container {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

label {
  font-weight: bold;
  color: #333;
}

textarea,
input[type="number"],
select {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1rem;
  transition: border-color 0.3s ease;
}

textarea:focus,
input[type="number"]:focus,
select:focus {
  outline: none;
  border-color: #007bff;
}

button {
  align-self: flex-start;
  padding: 0.5rem 1rem;
  /* background-color: #007bff; */
  /* color: white; */
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

button:hover {
  background-color: #0056b3;
}
</style>
