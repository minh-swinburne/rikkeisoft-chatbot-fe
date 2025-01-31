<template>
  <q-form @submit.prevent="emit('submit', register)">
    <q-input
      v-model="username"
      autocomplete="username"
      label="Username"
      outlined
      autofocus
      required
      :class="{ 'q-mb-md': !!isInvalidUsername }"
      :rules="[
        (val) => (val && val.length > 0) || 'Username is required',
        (val) =>
          (val && /^[a-zA-Z][a-zA-Z0-9_]{3,20}$/.test(val)) ||
          'Username must start with a letter and contain only alphanumeric characters or underscores',
      ]"
    />
    <div class="row q-col-gutter-sm">
      <div class="col-6">
        <q-input
          v-model="firstname"
          autocomplete="given-name"
          label="First Name"
          outlined
          required
          :class="{ 'q-mb-md': firstname.length == 0 }"
          :rules="[(val) => (val && val.length > 0) || 'First name is required']"
        />
      </div>
      <div class="col-6">
        <q-input
          v-model="lastname"
          autocomplete="family-name"
          label="Last Name (Optional)"
          outlined
        />
      </div>
    </div>
    <div class="row q-col-gutter-sm items-center">
      <div class="col">
        <q-input
          v-model="email"
          autocomplete="email"
          label="Email"
          type="email"
          outlined
          required
          :class="{ 'q-mb-md': !!isInvalidEmail }"
          :rules="[
            (val) => (val && val.length > 0) || 'Email is required',
            (val) =>
              (val && /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(val)) ||
              'Invalid email address',
          ]"
        />
      </div>
    </div>
    <div class="row q-col-gutter-sm">
      <div class="col-6">
        <q-input
          v-model="password"
          autocomplete="new-password"
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
      </div>
      <div class="col-6">
        <q-input
          v-model="confirmPassword"
          autocomplete="new-password"
          label="Confirm Password"
          type="password"
          outlined
          required
          :class="{
            'q-mb-md': confirmPassword.length == 0 || password !== confirmPassword,
          }"
          :rules="[
            (val) => (val && val.length > 0) || 'Confirm password is required',
            (val) => val === password || 'Passwords do not match',
          ]"
        />
      </div>
    </div>
    <div class="q-mt-md login-btn">
      <q-btn
        :loading="loading"
        type="submit"
        label="Register"
        color="primary"
        class="full-width"
      />
    </div>
  </q-form>

  <q-btn
    :loading="props.authenticating"
    class="q-mt-md full-width"
    no-caps
    outline
    @click="emit('auth-google')"
  >
    <template v-slot:default>
      <div class="row items-center no-wrap">
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
      <div class="row items-center no-wrap">
        <q-icon
          name="img:https://learn.microsoft.com/en-us/azure/active-directory/develop/media/howto-add-branding-in-azure-ad-apps/ms-symbollockup_mssymbol_19.png"
          size="18px"
          class="q-mr-sm"
        />
        <div>Continue with Microsoft</div>
      </div>
    </template>
  </q-btn>

  <div class="row items-center justify-center q-mt-md">
    <p class="q-mb-none">Already have an account?</p>
    <q-btn :to="{ name: 'auth-login' }" class="full-width" color="primary" label="Login" flat />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useQuasar } from 'quasar'
import { useAuthStore } from '@/plugins/stores/auth'
import { apiClient } from '@/plugins/api'

const $q = useQuasar()
const authStore = useAuthStore()

const username = ref('')
const firstname = ref('')
const lastname = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const isPwd = ref(true)
const loading = ref(false)

const props = defineProps(['authenticating'])
const emit = defineEmits(['submit', 'auth-google', 'auth-microsoft'])

const isInvalidUsername = computed(() => {
  if (username.value.length === 0) return 'Username is required'
  return /^[a-zA-Z][a-zA-Z0-9_]{3,20}$/.test(username.value)
    ? false
    : 'Username must start with a letter and contain only alphanumeric characters or underscores'
})
const isInvalidEmail = computed(() => {
  if (email.value.length === 0) return 'Email is required'
  return /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email.value)
    ? false
    : 'Invalid email address'
})

async function register() {
  try {
    const userDetails = {
      username: username.value,
      firstname: firstname.value,
      lastname: lastname.value,
      email: email.value,
      password: password.value,
    }

    const response = await apiClient.auth.registerUser(userDetails)
    const { access_token, refresh_token } = response.data

    authStore.login(access_token, refresh_token)
    loading.value = false

    $q.notify({
      color: 'positive',
      icon: 'check_circle',
      message: 'Registration successful!',
    })
  } catch (error) {
    console.error('Registration failed', error)

    $q.notify({
      color: 'negative',
      icon: 'report_problem',
      message: 'Registration failed',
    })

    throw error
  }
}
</script>

<style scoped>
</style>
