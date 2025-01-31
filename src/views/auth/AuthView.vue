<template>
  <q-page class="flex flex-center bg-grey-16">
    <div class="q-py-xl q-px-md">
      <q-card class="q-pa-lg">
        <q-card-section>
          <router-link to="/home" class="q-mb-md q-gutter-md flex flex-center">
            <q-img
              src="@/assets/rikkeiGPT.svg"
              alt="RikkeiGPT"
              fit="fill"
              height="80px"
              width="200px"
            />
          </router-link>

          <router-view
            @submit="handleSubmit"
            @auth-google="authenticateGoogle"
            @auth-microsoft="authenticateMicrosoft"
          />
        </q-card-section>
      </q-card>
    </div>
  </q-page>
</template>

<script setup>
import { apiClient } from '@/plugins/api'
import { loginRequest, msalInstance } from '@/plugins/sso/msalConfig'
import { useAuthStore } from '@/plugins/stores/auth'
import { useQuasar } from 'quasar'
import { onMounted, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { googleTokenLogin } from 'vue3-google-login'

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

async function authenticateGoogle() {
  try {
    authenticating.value = true

    const googleUser = await googleTokenLogin()
    const response = await apiClient.auth.authenticateGoogle(googleUser.access_token)
    const { access_token, refresh_token } = response.data

    authStore.login(access_token, refresh_token)
    authenticating.value = false

    $q.notify({
      color: 'positive',
      icon: 'check_circle',
      message: response.status === 200 ? 'Login successful!' : 'Registration successful!',
    })
    $router.push('/chat')
  } catch (error) {
    console.error('Google login failed', error)
    authenticating.value = false
    authStore.logout()
  }
}

async function authenticateMicrosoft() {
  try {
    authenticating.value = true
    await msalInstance.initialize()

    const loginResponse = await msalInstance.loginPopup(loginRequest)
    const response = await apiClient.auth.authenticateMicrosoft(
      loginResponse.accessToken,
      loginResponse.idToken,
    )
    const { access_token, refresh_token } = response.data

    authStore.login(access_token, refresh_token)
    authenticating.value = false

    $q.notify({
      color: 'positive',
      icon: 'check_circle',
      message: response.status === 200 ? 'Login successful!' : 'Registration successful!',
    })
    $router.push('/chat')
  } catch (error) {
    console.error('Microsoft login failed:', error)
    authenticating.value = false
    authStore.logout()
  }
}

onMounted(() => {
  $q.dark.set(false)
})
</script>

<style scoped></style>
