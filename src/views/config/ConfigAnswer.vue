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
            <q-tab v-for="(tab, key) in tabs" :key="key" :name="key" :label="tab" no-caps />
          </q-tabs>
          <q-separator />
          <q-tab-panels v-model="activeTab">
            <q-tab-panel v-for="(tab, key) in tabs" :key="key" :name="key">
              <ConfigForm :tab="tab" />
            </q-tab-panel>
          </q-tab-panels>
        </q-card>
      </q-page>
</template>

<script setup>
import {  useRoute } from 'vue-router'
import {  ref } from 'vue'
import ConfigForm from '@/components/ConfigForm.vue'

const $route = useRoute()

const tabs = {
  general_config: 'General Chat Configuration',
  coding_config: 'Coding Chat Configuration',
  docs_config: 'Documentation Chat Configuration',
}

const activeTab = ref($route.query.tab || Object.keys(tabs)[0])
</script>

<style>
@media (max-width: 599px) {
  .q-page-container .q-btn {
    width: 100%;
    margin-top: 16px;
  }
}
</style>