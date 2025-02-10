<template>
  <q-layout view="hHh LpR fFf">
    <q-header bordered>
      <q-toolbar>
        <app-navbar />
      </q-toolbar>
    </q-header>

    <q-page-container>
      <q-page class="flex flex-center">
        <q-card flat bordered class="q-pa-lg text-center">
          <q-card-section>
            <router-view />
          </q-card-section>
          <q-card-actions align="center" style="gap: 0.5rem;">
            <q-btn icon="arrow_back" label="Back" flat @click="$router.back()" />
            <q-btn to="/" icon="home" color="primary" label="Home" unelevated replace />
          </q-card-actions>
        </q-card>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { useRouter } from 'vue-router'
import AppNavbar from '@/components/AppNavbar.vue'

const $router = useRouter()
</script>
