<template>
  <q-form @submit.prevent="emit('submit', register)">
    <q-input
      v-model="username"
      autocomplete="username"
      label="Username"
      outlined
      autofocus
      required
      :rules="[
        (val) => !!val || 'Username is required',
        (val) =>
          (val && /^[a-zA-Z][a-zA-Z0-9_]{3,20}$/.test(val)) ||
          'Username must start with a letter and contain only alphanumeric characters or underscores',
      ]"
    />

    <div class="row q-col-gutter-sm q-mt-none">
      <div class="col-sm-6 col-12 q-pt-none">
        <q-input
          v-model="firstname"
          autocomplete="given-name"
          label="First Name"
          outlined
          required
          :rules="[(val) => !!val || 'First name is required']"
        />
      </div>

      <div class="col-sm-6 col-12 q-pt-none">
        <q-input
          v-model="lastname"
          autocomplete="family-name"
          label="Last Name (Optional)"
          outlined
          :rules="[(val) => true]"
        />
      </div>
    </div>

    <div class="row q-col-gutter-sm q-mt-none items-center">
      <div class="col q-pt-none">
        <q-input
          v-model="email"
          autocomplete="email"
          label="Email"
          type="email"
          outlined
          required
          :rules="[
            (val) => !!val || 'Email is required',
            (val) =>
              (val && /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(val)) ||
              'Invalid email address',
          ]"
        />
      </div>
    </div>

    <div class="row q-col-gutter-sm q-mt-none">
      <div class="col-sm-6 col-12 q-pt-none" style="min-width: 250px">
        <q-input
          v-model="password"
          autocomplete="new-password"
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
      </div>

      <div class="col-sm-6 col-12 q-pt-none" style="min-width: 250px">
        <q-input
          v-model="confirmPassword"
          autocomplete="new-password"
          label="Confirm Password"
          type="password"
          outlined
          required
          :rules="[
            (val) => !!val || 'Confirm password is required',
            (val) => val === password || 'Passwords do not match',
          ]"
        />
      </div>
    </div>

    <div class="q-mt-md">
      <q-btn
        :loading="props.authenticating"
        type="submit"
        label="Register"
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
    <p class="q-mb-none">Already have an account?</p>
    <q-btn :to="{ name: 'auth-login' }" class="full-width" color="primary" label="Login" flat />
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
const firstname = ref('')
const lastname = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const isPwd = ref(true)
const loading = ref(false)

const props = defineProps(['authenticating'])
const emit = defineEmits(['submit', 'auth'])

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
      type: 'positive',
      message: 'Registration successful!',
    })
  } catch (error) {
    console.error('Registration failed', error)

    $q.notify({
      type: 'negative',
      message: 'Registration failed',
    })

    throw error
  }
}
</script>

<style scoped></style>
