<template>
  <q-layout view="hHh LpR fFf">
    <q-header bordered>
      <q-toolbar>
        <AppNavbar />
      </q-toolbar>
    </q-header>
    <router-view />
  </q-layout>
</template>

<script setup>
import AppNavbar from '@/components/AppNavbar.vue'
</script>
