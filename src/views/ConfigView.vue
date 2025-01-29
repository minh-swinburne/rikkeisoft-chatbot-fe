<template>
  <q-layout view="hHh LpR fFf" :class="{ 'bg-dark': $q.dark.isActive }">
    <q-header bordered :class="$q.dark.isActive ? 'bg-dark' : 'bg-primary'">
      <q-toolbar>
        <app-navbar />
      </q-toolbar>
    </q-header>

    <q-page-container>
      <q-page padding class="max-width-70 q-pa-md">
        <q-card flat bordered class="q-pa-md">
          <q-tabs v-model="activeTab" class="q-mb-md">
            <q-tab v-for="(tab, key) in tabs" :key="key" :name="key" :label="tab" />
          </q-tabs>
          <q-separator />
          <q-tab-panels v-model="activeTab">
            <q-tab-panel v-for="(tab, key) in tabs" :key="key" :name="key">
              <q-form @submit="handleSubmit(key)">
                <div class="row items-center justify-between q-mb-md">
                  <h5 class="q-my-none">{{ tab }}</h5>
                  <q-btn
                    :label="isEditing ? 'Apply' : 'Edit'"
                    color="primary"
                    @click="toggleEdit"
                    :icon="isEditing ? 'check' : 'edit'"
                    :class="{ 'q-ml-sm': $q.screen.gt.xs }"
                  />
                </div>
                <q-input
                  v-model="config.instructions"
                  outlined
                  type="textarea"
                  label="Instructions"
                  :readonly="!isEditing"
                  rows="12"
                  class="instruction-textarea"
                />

                <q-input
                  v-if="config.messageTemplate"
                  v-model="config.messageTemplate"
                  outlined
                  type="textarea"
                  label="Message Template"
                  :readonly="!isEditing"
                  rows="4"
                  class="q-mt-md"
                />

                <q-select
                  v-model="config.model"
                  :options="config.modelOptions"
                  label="Model"
                  outlined
                  :disable="!isEditing"
                  class="q-mt-md"
                />

                <q-input
                  v-model.number="config.maxTokens"
                  outlined
                  type="number"
                  label="Max Tokens"
                  :readonly="!isEditing"
                  :min="1"
                  :max="8192"
                  class="q-mt-md"
                />

                <q-input
                  v-model.number="config.temperature"
                  outlined
                  type="number"
                  label="Temperature"
                  :readonly="!isEditing"
                  :step="0.1"
                  :min="0"
                  :max="1"
                  class="q-mt-md"
                />
              </q-form>
            </q-tab-panel>
          </q-tab-panels>
        </q-card>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import AppNavbar from '@/components/AppNavbar.vue'
import { apiClient } from '@/plugins/api'
import { useQuasar } from 'quasar'
import { onMounted, ref, watch } from 'vue'

const $q = useQuasar()
const isDark = ref(localStorage.getItem('darkMode') === 'true')

const tabs = {
  answer_generation: 'Answer Generation',
  question_suggestion: 'Question Suggestion',
  name_generation: 'Chat Name Generation',
}

const activeTab = ref('answer_generation')
const isEditing = ref(false)
const config = ref({
  instructions: '',
  messageTemplate: null,
  modelOptions: [],
  model: '',
  maxTokens: 1,
  temperature: 0.5,
})

const loadConfig = async (tab) => {
  try {
    config.value = {
      instructions: '',
      messageTemplate: null,
      modelOptions: [],
      model: '',
      maxTokens: 1,
      temperature: 0.5,
    }
    const response = await apiClient.config.getConfig(tab)
    config.value = {
      instructions: response.data.system_prompt,
      messageTemplate: response.data.message_template?.join('\n') || null,
      modelOptions: response.data.model_options,
      model: response.data.params.model,
      maxTokens: response.data.params.max_tokens,
      temperature: response.data.params.temperature,
    }
    console.log('Config loaded:', response.data)
  } catch (error) {
    console.error('Error fetching config:', error)
    $q.notify({
      color: 'negative',
      message: 'Failed to load configuration.',
      icon: 'report_problem',
    })
  }
}

onMounted(() => {
  loadConfig(activeTab.value)
  const savedDarkMode = localStorage.getItem('darkMode')
  if (savedDarkMode !== null) {
    isDark.value = savedDarkMode === 'true'
    $q.dark.set(isDark.value)
  }
})

watch(activeTab, (newTab) => {
  loadConfig(newTab)
})

const toggleEdit = () => {
  if (isEditing.value) {
    handleSubmit(activeTab.value)
  }
  isEditing.value = !isEditing.value
}

const handleSubmit = async (tab) => {
  try {
    const response = await apiClient.config.updateConfig(tab, config)
    console.log('Updated config:', response.data)
    $q.notify({
      color: 'positive',
      message: `${tabs[tab]} configuration updated successfully.`,
      icon: 'check_circle',
    })
  } catch (error) {
    console.error('Error updating config:', error.response || error)
    $q.notify({
      color: 'negative',
      message: 'Failed to update configuration.',
      icon: 'report_problem',
    })
  }
}
</script>

<style>
.instruction-textarea textarea {
  min-height: 200px;
}

.max-width-70 {
  max-width: 70%;
  margin: 0 auto; /* Optional: centers the list */
}

@media (max-width: 599px) {
  .q-page-container .q-btn {
    width: 100%;
    margin-top: 16px;
  }
}
</style>
