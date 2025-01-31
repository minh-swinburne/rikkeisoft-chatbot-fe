<template>
  <q-layout view="hHh LpR fFf" :class="{ 'bg-dark': $q.dark.isActive }">
    <q-header bordered :class="$q.dark.isActive ? 'bg-dark' : 'bg-primary'">
      <q-toolbar>
        <app-navbar />
      </q-toolbar>
    </q-header>

    <q-page-container>
      <q-page class="flex flex-center">
        <q-card flat bordered class="q-pa-lg text-center">
          <q-card-section>
            <q-icon name="error" color="negative" size="4rem" />
            <h4 class="text-h4 q-mt-md q-mb-sm">Access Denied</h4>
            <p class="text-body1 q-mb-md">You don't have permission to access this page.</p>
          </q-card-section>
          <q-card-actions align="center">
            <q-btn to="/" color="primary" label="Go to Home" unelevated />
          </q-card-actions>
        </q-card>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import AppNavbar from '@/components/AppNavbar.vue'

</script>
