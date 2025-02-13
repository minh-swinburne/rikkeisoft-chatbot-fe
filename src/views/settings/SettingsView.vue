<template>
  <app-layout :tabs="tabs" label="Settings">
    <router-view />
  </app-layout>
</template>

<script setup>
import AppLayout from '@/components/AppLayout.vue'

const tabs = [
  { name: 'My Profile', icon: 'badge', path: { name: 'settings-profile' } },
  { name: 'Authentication', icon: 'lock', path: { name: 'settings-auth' } },
]
</script>

<style scoped></style>
