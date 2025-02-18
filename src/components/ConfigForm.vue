<template>
  <q-form @submit.prevent="saveConfig(tab)">
    <div class="row items-center justify-between q-mb-md">
      <h5 class="q-my-none">{{ tab }}</h5>

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
        @click="loadConfig(activeTab, true)"
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
        outlined
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
        outlined
      />
    </div>

    <div class="row items-center q-my-lg q-gutter-y-sm">
      <div class="col-12 col-sm-6 text-subtitle1">Model</div>
      <q-select
        v-model="config.model"
        :options="config.modelOptions"
        :readonly="!editing"
        class="col-grow"
        outlined
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
        outlined
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
        outlined
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
        outlined
      />
    </div>

    <div class="row items-center q-my-lg q-gutter-y-sm">
      <div class="col text-subtitle1">Stream</div>
      <q-toggle
        v-model="config.stream"
        :disable="!editing"
        color="primary"
        class="col-grow"
      />
    </div>
  </q-form>
</template>

<script setup>
import { apiClient } from '@/plugins/api'
import { useQuasar } from 'quasar'
import { useRouter, useRoute } from 'vue-router'
import { onMounted, ref, watch } from 'vue'
import ConfigForm from '@/components/ConfigForm.vue'

const $q = useQuasar()
const $route = useRoute()
const $router = useRouter()

const props = defineProps({
  tab: String,
})

const tabs = {
  general_config: 'General Chat Configuration',
  coding_config: 'Coding Chat Configuration',
  docs_config: 'Documentation Chat Configuration',
}

const tab = props.tab

console.log(tab)

const activeTab = ref($route.query.tab || Object.keys(tabs)[0])
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
  if ($route.query.tab && tabs[$route.query.tab]) {
    activeTab.value = $route.query.tab
  }
  loadConfig(activeTab.value)
})

watch(activeTab, (newTab) => {
  $router.replace({ query: { tab: newTab } })
  loadConfig(newTab)
})

watch(() => $route.query.tab, (newTab) => {
  if (newTab && tabs[newTab]) {
    activeTab.value = newTab
  }
})

async function toggleEdit(save = false) {
  if (editing.value && save) {
    console.log('Saving config...')
    await saveConfig(activeTab.value)
  } else {
    console.log('Loading config...')
    await loadConfig(activeTab.value)
  }
  editing.value = !editing.value
}

async function loadConfig(tab, refresh = false) {
  loading.value = true
  const task = $router.currentRoute.value.name
  try {
    const response = await apiClient.config.getConfig(task, tab, refresh)
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
  const task = $router.currentRoute.value.name
  try {
    const response = await apiClient.config.updateConfig(task, tab, config.value)
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