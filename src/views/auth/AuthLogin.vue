<template>
  <q-form @submit.prevent="emit('submit', login)">
    <q-input
      v-model="username"
      autocomplete="username"
      label="Username"
      outlined
      autofocus
      required
      :rules="[(val) => !!val || 'Username or Email is required']"
    />

    <q-input
      v-model="password"
      autocomplete="current-password"
      label="Password"
      outlined
      required
      :type="isPwd ? 'password' : 'text'"
      :rules="[(val) => !!val || 'Password is required']"
    >
      <template #append>
        <q-icon
          :name="isPwd ? 'visibility_off' : 'visibility'"
          class="cursor-pointer"
          @click="isPwd = !isPwd"
        />
      </template>
    </q-input>

    <div class="q-mt-md">
      <q-btn
        :loading="props.authenticating"
        type="submit"
        label="Login"
        color="primary"
        class="full-width"
        unelevated
      />
    </div>
  </q-form>

  <q-btn
    v-for="(provider, key) in ssoProviders"
    :key="key"
    :loading="props.authenticating"
    class="q-mt-sm full-width"
    no-caps
    outline
    @click="emit('auth', key)"
  >
    <template #default>
      <div class="row items-center no-wrap">
        <q-icon
          :name="`img:${provider.logo}`"
          size="18px"
          class="q-mr-sm"
        />
        <div>Continue with {{ provider.name }}</div>
      </div>
    </template>
  </q-btn>

  <div class="row items-center justify-center q-mt-md">
    <p class="q-mb-none">Don't have an account?</p>
    <q-btn
      :to="{ name: 'auth-register' }"
      class="full-width"
      color="primary"
      label="Register"
      flat
    />
  </div>
</template>

<script setup>
import { apiClient } from '@/plugins/api'
import { ssoProviders } from '@/plugins/sso'
import { useAuthStore } from '@/plugins/stores/auth'
import { useQuasar } from 'quasar'
import { ref } from 'vue'

const $q = useQuasar()
const authStore = useAuthStore()

const username = ref('')
const password = ref('')
const isPwd = ref(true)

const props = defineProps(['authenticating'])
const emit = defineEmits(['submit', 'auth'])

async function login() {
  try {
    const params = new URLSearchParams()
    params.append('username', username.value)
    params.append('password', password.value)

    const response = await apiClient.auth.authenticateNative(params)
    const { access_token, refresh_token } = response.data

    authStore.login(access_token, refresh_token)

    $q.notify({
      type: 'positive',
      message: 'Login successful!',
    })
  } catch (error) {
    console.error('Login failed', error)

    $q.notify({
      type: 'negative',
      message: error.response?.data?.detail || 'Login failed',
    })

    throw error
  }
}
</script>

<style scoped></style>
