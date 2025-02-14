<template>
  <q-layout view="hHh LpR fFf">
    <q-header bordered>
      <q-toolbar>
        <AppNavbar />
      </q-toolbar>
    </q-header>

    <q-page-container class="row justify-center">
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import AppNavbar from '@/components/AppNavbar.vue'
</script>
