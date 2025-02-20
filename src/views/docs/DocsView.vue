<template>
  <!--
  General description:
  This component represents the main layout for document-related views. It includes tabs for navigating between different document views.

  Methods:
  No specific methods are defined in this component.
  -->
  <AppLayout :tabs="tabs" label="Documents">
    <router-view />
  </AppLayout>
</template>

<script setup>
import AppLayout from '@/components/AppLayout.vue'

const tabs = [
  { name: 'Current Documents', icon: 'description', path: { name: 'docs-list' } },
  { name: 'Upload New Document', icon: 'cloud_upload', path: { name: 'docs-upload' } },
]
</script>

<style scoped></style>
