<template>
  <!--
  General description:
  This component represents the main layout for diet-related views. It includes tabs for navigating between different diet views.

  Methods:
  No specific methods are defined in this component.
  -->
  <AppLayout :tabs="tabs" label="Diet">
    <router-view />
  </AppLayout>
</template>

<script setup>
import AppLayout from '@/components/AppLayout.vue'

const tabs = [
  { name: 'Food Detection', icon: 'search', path: { name: 'diet-detection' } }
]
</script>

<style scoped></style>
