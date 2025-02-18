<template>
  <AppLayout :tabs="tabs" label="Configuration">
    <router-view />
  </AppLayout>
</template>

<script setup>
import AppLayout from '@/components/AppLayout.vue'


const tabs = [
  { name: 'Answer Generation', icon: 'forum', path: { name: 'config-answer' } },
  { name: 'Message Summarization', icon: 'summarize', path: { name: 'config-summary' } },
  { name: 'Question Suggestion', icon: 'lightbulb', path: { name: 'config-suggestion' } },
  { name: 'Chat Name Generation', icon: 'menu_open', path: { name: 'config-name' } },
]


</script>


