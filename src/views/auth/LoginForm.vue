<template>
  <q-form @submit.prevent="emit('submit', login)">
    <q-input
      v-model="username"
      label="Username / Email"
      outlined
      autofocus
      required
      :class="{ 'q-mb-md': username.length == 0 }"
      :rules="[(val) => (val && val.length > 0) || 'Username or Email is required']"
    />
    <q-input
      v-model="password"
      autocomplete="current-password"
      label="Password"
      outlined
      required
      :type="isPwd ? 'password' : 'text'"
      :class="{ 'q-mb-md': password.length == 0 }"
      :rules="[(val) => (val && val.length > 0) || 'Password is required']"
    >
      <template v-slot:append>
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

  <q-btn :loading="props.authenticating" class="q-mt-sm full-width" no-caps outline @click="emit('auth-google')">
    <template v-slot:default>
      <div class="row no-wrap">
        <q-icon
          name="img:https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
          size="18px"
          class="q-mr-sm"
        />
        <div>Continue with Google</div>
      </div>
    </template>
  </q-btn>

  <q-btn :loading="props.authenticating" class="q-mt-sm full-width" no-caps outline @click="emit('auth-microsoft')">
    <template v-slot:default>
      <div class="row no-wrap">
        <q-icon
          name="img:https://learn.microsoft.com/en-us/azure/active-directory/develop/media/howto-add-branding-in-azure-ad-apps/ms-symbollockup_mssymbol_19.png"
          size="18px"
          class="q-mr-sm"
        />
        <div>Continue with Microsoft</div>
        <q-space />
      </div>
    </template>
  </q-btn>

  <div class="row items-center justify-center q-mt-md">
    <p class="q-mb-none">Don't have an account?</p>
    <q-btn :to="{ name: 'auth-register' }" class="full-width" color="primary" label="Register" flat />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useQuasar } from 'quasar'
import { useAuthStore } from '@/plugins/stores/auth'
import { apiClient } from '@/plugins/api'

const $q = useQuasar()
const authStore = useAuthStore()

const username = ref('')
const password = ref('')
const isPwd = ref(true)

const props = defineProps(['authenticating'])
const emit = defineEmits(['submit', 'auth-google', 'auth-microsoft'])

async function login() {
  try {
    const params = new URLSearchParams()
    params.append('username', username.value)
    params.append('password', password.value)

    const response = await apiClient.auth.authenticateNative(params)
    const { access_token, refresh_token } = response.data

    authStore.login(access_token, refresh_token)

    $q.notify({
      color: 'positive',
      icon: 'check_circle',
      message: 'Login successful!',
    })
  } catch (error) {
    console.error('Login failed', error)

    $q.notify({
      color: 'negative',
      icon: 'report_problem',
      message: 'Login failed',
    })

    throw error
  }
}
</script>

<style scoped>
</style>
