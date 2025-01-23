<template>
  <q-layout view="hHh LpR fFf" :class="{ 'bg-dark': $q.dark.isActive }">
    <q-header bordered :class="$q.dark.isActive ? 'bg-dark' : 'bg-primary'">
      <q-toolbar>
        <nav-bar />
      </q-toolbar>
    </q-header>

    <div class="main-container">
      <div class="tabs">
        <button
          v-for="(tab, key, index) in tabs"
          :key="index"
          class="btn btn-primary"
          :class="{ active: activeTab === key }"
          @click="changeTab(key)"
        >
          {{ tab }}
        </button>
      </div>

      <div class="tab-content">
        <div>
          <h2>{{ tabs[activeTab] }}</h2>
          <form @submit.prevent="handleSubmit(activeTab)">
            <div class="input-container">
              <label for="instructions">Instructions:</label>
              <textarea
                id="instructions"
                v-model="config.instructions"
                :readonly="!isEditing"
                rows="10"
                placeholder="Enter your instructions here..."
              ></textarea>
            </div>

            <div class="input-container" v-if="config.messageTemplate">
              <label for="message-template">Message Template:</label>
              <textarea
                id="message-template"
                v-model="config.messageTemplate"
                :readonly="!isEditing"
                rows="5"
                placeholder="Enter your message template here..."
              ></textarea>
            </div>

            <div class="input-container">
              <label for="model">Model:</label>
              <select
                id="model"
                v-model="config.model"
                :disabled="!isEditing"
              >
                <option
                  v-for="(option, index) in config.modelOptions"
                  :key="index"
                  :value="option"
                >
                  {{ option }}
                </option>
              </select>
            </div>

            <div class="input-container">
              <label for="max-tokens">Max Tokens:</label>
              <input
                id="max-tokens"
                v-model="config.maxTokens"
                :readonly="!isEditing"
                type="number"
                min="1"
                max="8192"
                placeholder="Enter max tokens"
              />
            </div>

            <div class="input-container">
              <label for="temperature">Temperature:</label>
              <input
                id="temperature"
                v-model="config.temperature"
                :readonly="!isEditing"
                type="number"
                step="0.1"
                min="0"
                max="1"
                placeholder="Enter temperature (0-1)"
              />
            </div>
            <button
              type="button"
              class="btn btn-primary"
              @click="toggleEdit"
            >
              {{ isEditing ? "Apply" : "Edit" }}
            </button>
          </form>
        </div>

      </div>
    </div>
  </q-layout>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { apiClient } from "@/plugins/api";
import NavBar from "@/components/NavBar.vue";


const tabs = {
  answer_generation: "Answer Generation",
  question_suggestion: "Question Suggestion",
  name_generation: "Chat Name Generation",
};
const activeTab = ref("answer_generation"); // Default active tab
const isEditing = ref(false); // Track edit state
const config = ref({
  instructions: "",
  messageTemplate: null,
  modelOptions: [],
  model: "",
  maxTokens: 1,
  temperature: 0.5,
});


// Fetch the configuration for a specific tab
const loadConfig = async (tab) => {
  try {
    const response = await apiClient.config.getConfig(tab)
    config.value = {
      instructions: response.data.system_prompt,
      messageTemplate: response.data.message_template?.join("\n") || null,
      modelOptions: response.data.model_options,
      model: response.data.params.model,
      maxTokens: response.data.params.max_tokens,
      temperature: response.data.params.temperature,
    };

    console.log("Config loaded:", response.data);
  } catch (error) {
    console.error("Error fetching config:", error);
    alert("Failed to load configuration.");
  }
};

// Load the config when the page loads or when switching tabs
onMounted(() => {
  loadConfig(activeTab.value);
});

// Switch between tabs
const changeTab = (tab) => {
  activeTab.value = tab;
  loadConfig(tab); // Load the configuration for the selected tab
};

// Toggle between edit and apply
const toggleEdit = () => {
  if (isEditing.value) {
    handleSubmit(activeTab.value); // Save changes when switching back
  }
  isEditing.value = !isEditing.value;
};

// Submit form data to backend
const handleSubmit = async (tab) => {
  try {
    const response = await apiClient.config.updateConfig(tab, config);

    console.log("Updated config:", response.data);
    alert(`${tab} configuration updated successfully.`);
  } catch (error) {
    console.error("Error fetching config:", error.response || error);
    alert("Failed to load configuration.");
}
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
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border: none;
  background-color: #dc3545;
  color: white;
  font-size: 1rem;
  cursor: pointer;
  border-radius: 4px;
  transition: background-color 0.3s ease;
}

button:hover {
  background-color: #c82333;
}
</style>
