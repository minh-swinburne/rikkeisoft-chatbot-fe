<template>
  <!--
  General description:
  This component represents the authentication view, including login and registration forms. It handles user authentication and redirects.

  Methods:
  - handleSubmit: Handles the form submission and redirects on success.
  - authenticate: Authenticates the user using a specified provider.
  -->
  <q-page class="flex flex-center">
    <div class="q-py-xl q-px-md">
      <q-card class="q-pa-lg" bordered flat>
        <q-card-section>
          <router-link to="/home" class="q-gutter-md flex flex-center">
            <q-img
              src="@/assets/rikkeiGPT.svg"
              alt="RikkeiGPT"
              fit="fill"
              height="80px"
              width="200px"
            />
          </router-link>

          <router-view
            :authenticating="authenticating"
            @submit="handleSubmit"
            @auth="authenticate"
          />
        </q-card-section>
      </q-card>
    </div>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import { useQuasar } from 'quasar'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/plugins/stores/auth'
import { ssoProviders } from '@/plugins/sso/index'

const $q = useQuasar()
const $route = useRoute()
const $router = useRouter()
const authStore = useAuthStore()

const authenticating = ref(false)

async function handleSubmit(callback) {
  try {
    authenticating.value = true
    await callback()
    $router.push($route.redirectedFrom || { name: 'chat-start' })
  } catch {
    authenticating.value = false
    authStore.logout()
  }
}

async function authenticate(provider) {
  try {
    authenticating.value = true

    const response = await ssoProviders[provider].authenticate()
    const { access_token, refresh_token } = response.data

    authStore.login(access_token, refresh_token)
    authenticating.value = false

    $q.notify({
      type: 'positive',
      message: response.status === 200 ? 'Login successful!' : 'Registration successful!',
    })
    $router.push('/chat')
  } catch (error) {
    console.error(ssoProviders[provider].name + ' authentication failed', error)
    authenticating.value = false
    authStore.logout()
    $q.notify({
      type: 'negative',
      message: ssoProviders[provider].name + ' authenticationn failed',
    })
  }
}
</script>

<style scoped></style>
