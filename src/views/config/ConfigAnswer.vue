<template>
  <q-page padding class="col-grow" style="max-width: 800px">
    <q-card flat bordered class="q-pa-md">
      <q-tabs
        v-model="activeTab"
        class="q-mb-md"
        active-class="link"
        outside-arrows
        mobile-arrows
        inline-label
      >
        <q-tab v-for="(name, tab) in tabs" :key="tab" :name="tab" :label="name" no-caps />
      </q-tabs>
      <q-separator />
      <q-tab-panels v-model="activeTab">
        conmemay
        <q-tab-panel v-for="(name, tab) in tabs" :key="tab" :name="tab">
          <ConfigForm :name="name" :tab="tab" task="answer_generation" />
        </q-tab-panel>
      </q-tab-panels>
    </q-card>
  </q-page>
</template>

<script setup>
import ConfigForm from '@/components/ConfigForm.vue'
import { onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const $route = useRoute()
const $router = useRouter()

const tabs = {
  general: 'General Chatbot',
  coder: 'Coder Chatbot',
  docs: 'Documents Chatbot',
}

const activeTab = ref(Object.keys(tabs)[0])

onMounted(() => {
  if ($route.query.tab && tabs[$route.query.tab]) {
    activeTab.value = $route.query.tab
  }
})

watch(activeTab, (newTab) => {
  $router.replace({ query: { tab: newTab } })
})

watch(
  () => $route.query.tab,
  (newTab) => {
    if (newTab && tabs[newTab]) {
      activeTab.value = newTab
    }
  },
)
</script>

<style>
@media (max-width: 599px) {
  .q-page-container .q-btn {
    width: 100%;
    margin-top: 16px;
  }
}
</style>
