<template>
  <!--
  General description:
  This component represents the main layout for user-related views. It includes a header and a container for nested routes.

  Methods:
  No specific methods are defined in this component.
  -->
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
