<template>
  <app-layout :tabs="tabs" label="Documents">
    <router-view />
  </app-layout>
</template>

<script setup>
import AppLayout from '@/components/AppLayout.vue'

const tabs = [
  { name: 'Current Documents', icon: 'description', path: { name: 'docs-list' } },
  { name: 'Upload New Document', icon: 'cloud_upload', path: { name: 'docs-upload' } },
]
</script>

<style scoped></style>
