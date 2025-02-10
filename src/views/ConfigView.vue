<template>
  <q-layout view="hHh LpR fFf">
    <q-header bordered>
      <q-toolbar>
        <app-navbar />
      </q-toolbar>
    </q-header>

    <q-page-container>
      <q-page padding class="max-width-70 q-pa-md">
        <q-card flat bordered class="q-pa-md">
          <q-tabs v-model="activeTab" class="q-mb-md" active-class="link">
            <q-tab v-for="(tab, key) in tabs" :key="key" :name="key" :label="tab" />
          </q-tabs>
          <q-separator />
          <q-tab-panels v-model="activeTab">
            <q-tab-panel v-for="(tab, key) in tabs" :key="key" :name="key">
              <q-form @submit.prevent="saveConfig(tab)">
                <div class="row items-center justify-between q-mb-md">
                  <h5 class="q-my-none">{{ tab }}</h5>

                  <q-space />

                  <q-btn
                    :label="isEditing ? 'Apply' : 'Edit'"
                    :icon="isEditing ? 'check' : 'edit'"
                    :loading="loading"
                    color="primary"
                    unelevated
                    @click="toggleEdit(true)"
                  />

                  <q-btn
                    v-if="isEditing"
                    :loading="loading"
                    :class="{ 'q-ml-sm': $q.screen.gt.xs }"
                    label="Cancel"
                    icon="close"
                    color="negative"
                    flat
                    @click="toggleEdit(false)"
                  />
                </div>
                <q-input
                  v-model="config.instructions"
                  :readonly="!isEditing"
                  type="textarea"
                  label="Instructions"
                  class="instruction-textarea"
                  autogrow
                  outlined
                />

                <q-input
                  v-if="config.messageTemplate"
                  v-model="config.messageTemplate"
                  :readonly="!isEditing"
                  type="textarea"
                  label="Message Template"
                  class="q-mt-md"
                  autogrow
                  outlined
                />

                <q-select
                  v-model="config.model"
                  :options="config.modelOptions"
                  :readonly="!isEditing"
                  label="Model"
                  class="q-mt-md"
                  outlined
                />

                <q-input
                  v-model.number="config.maxTokens"
                  :readonly="!isEditing"
                  type="number"
                  label="Max Tokens"
                  min="1"
                  max="8192"
                  class="q-mt-md"
                  outlined
                />

                <q-input
                  v-model.number="config.temperature"
                  :readonly="!isEditing"
                  type="number"
                  label="Temperature"
                  step="0.1"
                  min="0"
                  max="1"
                  class="q-mt-md"
                  outlined
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

const tabs = {
  answer_generation: 'Answer Generation',
  question_suggestion: 'Question Suggestion',
  name_generation: 'Chat Name Generation',
}

const activeTab = ref('answer_generation')
const isEditing = ref(false)
const loading = ref(true)
const config = ref({
  instructions: '',
  messageTemplate: null,
  modelOptions: [],
  model: '',
  maxTokens: 1,
  temperature: 0.5,
})

onMounted(() => {
  loadConfig(activeTab.value)
})

watch(activeTab, (newTab) => {
  loadConfig(newTab)
})

async function toggleEdit(save = false) {
  if (isEditing.value && save) {
    await saveConfig(activeTab.value)
  }
  await loadConfig(activeTab.value)
  isEditing.value = !isEditing.value
}

async function loadConfig(tab) {
  loading.value = true
  try {
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
      type: 'negative',
      message: 'Failed to load configuration.',
    })
  }
  loading.value = false
}

async function saveConfig(tab) {
  loading.value = true
  try {
    const response = await apiClient.config.updateConfig(tab, config.value)
    console.log('Updated config:', response.data)
    $q.notify({
      type: 'positive',
      message: `${tabs[tab]} configuration updated successfully.`,
    })
  } catch (error) {
    console.error('Error updating config:', error.response || error)
    $q.notify({
      type: 'negative',
      message: 'Failed to update configuration.',
    })
  }
  loading.value = false
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
