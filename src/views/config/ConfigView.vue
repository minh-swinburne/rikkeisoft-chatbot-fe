<template>
  <!-- 
  General description: 
  This component provides a layout for configuration settings with tabs for different configuration sections.
  -->
  <AppLayout :tabs="tabs" label="Configuration">
    <router-view />
  </AppLayout>
</template>

<script setup>
import AppLayout from '@/components/AppLayout.vue'

const tabs = [
  { name: 'Answer Generation', icon: 'forum', path: { name: 'config-answer' } },
  { name: 'Message Summarization', icon: 'short_text', path: { name: 'config-summary' } },
  { name: 'Question Suggestion', icon: 'lightbulb', path: { name: 'config-suggestion' } },
  { name: 'Chat Name Generation', icon: 'format_quote', path: { name: 'config-name' } },
]
</script>
