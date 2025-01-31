<template>
  <q-layout view="hHh LpR fFf" :class="{ 'bg-dark': $q.dark.isActive }">
    <q-header bordered :class="$q.dark.isActive ? 'bg-dark' : 'bg-primary'">
      <q-toolbar>
        <app-navbar />
      </q-toolbar>
    </q-header>

    <q-page-container>
      <q-page padding class="max-width-70 q-pa-md">
        <q-card flat bordered class="q-pa-md">
          <div class="text-h6">Profile Settings</div>
          <q-form @submit="onSubmit" class="q-gutter-md">
            <div class="row justify-center q-mb-md">
              <q-avatar size="100px">
                <q-img :src="avatarUrl" />
                <q-file v-model="avatarFile" accept="image/*" style="display: none">
                  <template #append>
                    <q-icon name="attach_file" />
                  </template>
                </q-file>
              </q-avatar>
            </div>
            <div class="row justify-center q-mb-md">
              <q-btn flat @click="$refs.avatarInput.click()">Change Avatar</q-btn>
            </div>

            <q-input
              outlined
              v-model="email"
              label="Email"
              type="email"
              :rules="[(val) => !!val || 'Email is required', isValidEmail]"
              class="q-mb-md"
            />

            <q-input
              outlined
              v-model="firstname"
              label="First Name"
              :rules="[(val) => !!val || 'First name is required']"
              class="q-mb-md"
            />

            <q-input
              outlined
              v-model="lastname"
              label="Last Name"
              :rules="[(val) => !!val || 'Last name is required']"
              class="q-mb-md"
            />

            <q-input
              outlined
              v-model="username"
              label="Username"
              :rules="[(val) => !!val || 'Username is required']"
              class="q-mb-md"
            />

            <q-input
              outlined
              v-model="password"
              label="New Password"
              type="password"
              :rules="[
                (val) => !val || val.length >= 8 || 'Password must be at least 8 characters',
              ]"
              class="q-mb-md"
            />

            <q-input
              outlined
              v-model="confirmPassword"
              label="Confirm New Password"
              type="password"
              :rules="[(val) => !password || val === password || 'Passwords do not match']"
              class="q-mb-md"
            />

            <div>
              <q-btn label="Save Changes" type="submit" color="primary" />
            </div>
          </q-form>
        </q-card>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import AppNavbar from '@/components/AppNavbar.vue'
import { apiClient } from '@/plugins/api'
import { useQuasar } from 'quasar'
import { onMounted, ref } from 'vue'

const $q = useQuasar()

const email = ref('')
const firstname = ref('')
const lastname = ref('')
const username = ref('')
const password = ref('')
const confirmPassword = ref('')
const avatarUrl = ref('/placeholder.svg?height=100&width=100')
const avatarFile = ref(null)

const isValidEmail = (val) => {
  const emailPattern =
    /^(?=[a-zA-Z0-9@._%+-]{6,254}$)[a-zA-Z0-9._%+-]{1,64}@(?:[a-zA-Z0-9-]{1,63}\.){1,8}[a-zA-Z]{2,63}$/
  return emailPattern.test(val) || 'Invalid email'
}

const onSubmit = async () => {
  try {
    const formData = new FormData()
    formData.append('email', email.value)
    formData.append('firstname', firstname.value)
    formData.append('lastname', lastname.value)
    formData.append('username', username.value)
    if (password.value) {
      formData.append('password', password.value)
    }
    if (avatarFile.value) {
      formData.append('avatar', avatarFile.value)
    }

    const response = await apiClient.users.updateUser(formData)

    if (response.status === 200) {
      $q.notify({
        color: 'positive',
        textColor: 'white',
        icon: 'cloud_done',
        message: 'Profile updated successfully',
      })
    }
  } catch (error) {
    console.error('Error updating profile:', error)
    $q.notify({
      color: 'negative',
      textColor: 'white',
      icon: 'warning',
      message: 'Failed to update profile',
    })
  }
}

// Load user data when component mounts
onMounted(async () => {
  try {
    const userData = await apiClient.users.getCurrentUser()
    email.value = userData.email
    firstname.value = userData.firstname
    lastname.value = userData.lastname
    username.value = userData.username
    avatarUrl.value = userData.avatarUrl || '/placeholder.svg?height=100&width=100'
  } catch (error) {
    console.error('Error fetching user data:', error)
  }
})
</script>

<style scoped>
.max-width-70 {
  max-width: 70%;
  margin: 0 auto; /* Optional: centers the list */
}
</style>
