<template>
  <h5>Forgot Password</h5>
  <div class="text-subtitle2 q-mt-xs q-mb-md">
    Enter your email address to receive a password reset link.
  </div>

  <q-form @submit="sendResetEmail">
    <q-input
      v-model="email"
      type="email"
      autocomplete="email"
      label="Email"
      clearable
      outlined
      :rules="[
        (val) => !!val || 'Email is required',
        (val) => /.+@.+\..+/.test(val) || 'Email must be valid',
      ]"
    />
    <q-btn
      :loading="authenticating"
      type="submit"
      color="primary"
      label="Send Reset Email"
      class="full-width"
      unelevated
    />
  </q-form>

  <q-card-section v-if="showPasswordSection">
    <q-input v-model="newPassword" label="New Password" type="password" filled class="q-mb-md" />
    <q-input
      v-model="confirmPassword"
      label="Confirm Password"
      type="password"
      class="q-mb-lg"
      filled
    />
    <q-btn
      label="Reset Password"
      color="primary"
      class="full-width q-mb-lg"
      @click="resetPassword"
    />
  </q-card-section>

  <div class="row items-center justify-center q-mt-md">
    <p class="q-mb-none">Already have an account?</p>
    <q-btn :to="{ name: 'auth-login' }" class="full-width" color="primary" label="Login" flat />
  </div>
</template>

<script setup>
import { apiClient } from '@/plugins/api'
import { useQuasar } from 'quasar'
import { ref } from 'vue'

const $q = useQuasar()
const email = ref('')
const newPassword = ref('')
const confirmPassword = ref('')
const authenticating = ref(false)
const showPasswordSection = ref(false)

async function sendResetEmail() {
  if (!email.value) return

  authenticating.value = true
  try {
    await apiClient.auth.sendResetEmail({ email: email.value })
    $q.notify({
      type: 'positive',
      message: 'Password reset email sent successfully.',
    })
    showPasswordSection.value = true
  } catch (error) {
    console.error('Error sending reset email:', error)
    $q.notify({
      type: 'warning',
      message: 'This feature is under development.',
    })
    // $q.notify({
    //   type: 'negative',
    //   message: 'Failed to send password reset email.',
    // })
  } finally {
    authenticating.value = false
  }
}

async function resetPassword() {
  if (!newPassword.value || !confirmPassword.value || newPassword.value !== confirmPassword.value) {
    $q.notify({
      type: 'negative',
      message: 'Passwords do not match or are empty.',
    })
    return
  }

  // Add your reset password logic here
  try {
    await apiClient.auth.resetPassword({ email: email.value, password: newPassword.value })
    $q.notify({
      type: 'positive',
      message: 'Password reset successfully.',
    })
  } catch (error) {
    console.error('Error resetting password:', error)
    $q.notify({
      type: 'negative',
      message: 'Failed to reset password.',
    })
  }
}
</script>

<style scoped>
.full-width {
  width: 100%;
}
</style>
