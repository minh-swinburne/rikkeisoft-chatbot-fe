<template>
  <!--
  General description:
  This component provides a form to view and edit configuration settings for a task.

  Methods:
  - toggleEdit: Toggles the editing state and optionally saves the configuration.
  - loadConfig: Loads the configuration settings from the server.
  - saveConfig: Saves the configuration settings to the server.
  -->
  <q-form @submit.prevent="saveConfig">
    <div class="row items-center justify-between q-mb-md">
      <h5 class="q-my-none">{{ props.name }}</h5>

      <q-space />

      <q-btn
        v-if="editing"
        :loading="loading"
        label="Cancel"
        icon="close"
        flat
        @click="toggleEdit()"
      />

      <q-btn
        v-else
        :loading="loading"
        :text-color="$q.dark.isActive ? 'white' : 'black'"
        icon="refresh"
        color="shadow"
        unelevated
        round
        @click="loadConfig(true)"
      />

      <q-btn
        :loading="loading"
        :label="editing ? 'Apply' : 'Edit'"
        :icon="editing ? 'check' : 'edit'"
        color="primary"
        class="q-ml-sm"
        unelevated
        @click="toggleEdit(editing)"
      />
    </div>

    <div class="q-mt-md">
      <div class="text-subtitle1 q-mb-sm">System Prompt</div>
      <q-input
        v-model="config.instructions"
        :readonly="!editing"
        type="textarea"
        input-style="padding-top: 6px"
        autogrow
        filled
      />
    </div>

    <div v-if="config.messageTemplate" class="q-my-lg">
      <div class="text-subtitle1 q-mb-sm q-pt-sm">Message Template</div>
      <q-input
        v-model="config.messageTemplate"
        :readonly="!editing"
        type="textarea"
        input-style="padding-top: 6px"
        autogrow
        filled
      />
    </div>

    <div class="row items-center q-my-lg q-gutter-y-sm">
      <div class="col-12 col-sm-6 text-subtitle1">Model</div>
      <q-select
        v-model="config.model"
        :options="config.modelOptions"
        :readonly="!editing"
        class="col-grow"
        filled
      />
    </div>

    <div v-if="config.lengthLimit" class="row items-center q-my-lg q-gutter-y-sm">
      <div class="col-12 col-sm-9 text-subtitle1">Length Limit</div>
      <q-input
        v-model.number="config.lengthLimit"
        :readonly="!editing"
        :input-class="$q.screen.gt.xs ? 'text-right' : ''"
        class="col-grow"
        type="number"
        step="100"
        min="100"
        max="5000"
        filled
      />
    </div>

    <div class="row items-center q-my-lg q-gutter-y-sm">
      <div class="col-12 col-sm-9 text-subtitle1">Max Tokens</div>
      <q-input
        v-model.number="config.maxTokens"
        :readonly="!editing"
        :input-class="$q.screen.gt.xs ? 'text-right' : ''"
        class="col-grow"
        type="number"
        min="1"
        max="8192"
        filled
      />
    </div>

    <div class="row items-center q-my-lg q-gutter-y-sm">
      <div class="col-12 col-sm-9 text-subtitle1">Temperature</div>
      <q-input
        v-model.number="config.temperature"
        :readonly="!editing"
        :input-class="$q.screen.gt.xs ? 'text-right' : ''"
        class="col-grow"
        type="number"
        step="0.1"
        min="0"
        max="1"
        filled
      />
    </div>

    <div class="row items-center q-my-lg q-gutter-y-sm">
      <div class="col text-subtitle1">Stream</div>
      <q-toggle v-model="config.stream" :disable="!editing" color="primary" class="col-grow" />
    </div>
  </q-form>
</template>

<script setup>
import { apiClient } from '@/plugins/api'
import { useQuasar } from 'quasar'
import { onMounted, ref } from 'vue'

const $q = useQuasar()

const props = defineProps({
  name: String,
  task: String,
  tab: String,
})

const editing = ref(false)
const loading = ref(true)
const config = ref({
  instructions: '',
  messageTemplate: null,
  lengthLimit: null,
  modelOptions: [],
  model: '',
  maxTokens: 1,
  temperature: 0.5,
  stream: false,
})

onMounted(() => {
  loadConfig()
})

async function toggleEdit(save = false) {
  if (editing.value && save) {
    // console.log('Saving config...')
    await saveConfig()
  } else {
    // console.log('Loading config...')
    await loadConfig()
  }
  editing.value = !editing.value
}

async function loadConfig(refresh = false) {
  loading.value = true
  try {
    const response = await apiClient.config.getConfig(props.task, props.tab, refresh)
    config.value = {
      instructions: response.data.system_prompt,
      messageTemplate: response.data.message_template?.join('\n') || null,
      lengthLimit: response.data.length_limit ?? null,
      modelOptions: response.data.model_options,
      model: response.data.params.model,
      maxTokens: response.data.params.max_tokens,
      temperature: response.data.params.temperature,
      stream: response.data.params.stream,
    }
    // console.log('Config loaded:', response.data)
  } catch (error) {
    console.error('Error fetching config:', error)
    $q.notify({
      type: 'negative',
      message: 'Failed to load configuration.',
    })
  }
  loading.value = false
}

async function saveConfig() {
  loading.value = true
  try {
    await apiClient.config.updateConfig(props.task, props.tab, config.value)
    // console.log('Updated config:', response.data)
    $q.notify({
      type: 'positive',
      message: `Configuration for ${props.name} updated successfully.`,
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
