<template>
  <q-layout view="hHh LpR fFf" class="bg-dark">
    <q-header bordered :class="$q.dark.isActive ? 'bg-dark' : 'bg-primary'">
      <q-toolbar>
        <app-navbar />
      </q-toolbar>
    </q-header>

    <!-- Left Sidebar -->
    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      :width="280"
    >
      <q-list padding>
        <q-item-label header>Settings</q-item-label>
        
        <q-item  
          active
          :style="{ borderRadius: '5px', color: 'inherit' }"
          active-class="bg-shadow"
          class="q-ma-sm q-pa-sm"
          clickable
          v-ripple>
          <q-item-section>Profile</q-item-section>
        </q-item>
        
        <q-item
         :style="{ borderRadius: '5px', color: 'inherit' }"
          active-class="bg-shadow"
          class="q-ma-sm q-pa-sm"
          clickable
          v-ripple>
          <q-item-section>Account</q-item-section>
        </q-item>
        
        <q-item
         :style="{ borderRadius: '5px', color: 'inherit' }"
          active-class="bg-shadow"
          class="q-ma-sm q-pa-sm"
          clickable
          v-ripple>
          <q-item-section>Authentication</q-item-section>
        </q-item>
        
        <q-item
         :style="{ borderRadius: '5px', color: 'inherit' }"
          active-class="bg-shadow"
          class="q-ma-sm q-pa-sm"
          clickable
          v-ripple>
          <q-item-section>Organizations</q-item-section>
        </q-item>
        
        <q-item
         :style="{ borderRadius: '5px', color: 'inherit' }"
          active-class="bg-shadow"
          class="q-ma-sm q-pa-sm"
          clickable
          v-ripple>
          <q-item-section>Billing</q-item-section>
        </q-item>
        
        <q-item
         :style="{ borderRadius: '5px', color: 'inherit' }"
          active-class="bg-shadow"
          class="q-ma-sm q-pa-sm"
          clickable
          v-ripple>
          <q-item-section>Access Tokens</q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container class="bg-dark">
      <q-page padding>
        <div class="content-width q-pa-md">
          <div class="row items-center justify-between q-mb-lg">
            <div class="text-h4 text-white">Profile Settings</div>
            <div>
              <q-btn
                :label="isEditing ? 'Apply' : 'Edit'"
                :icon="isEditing ? 'check' : 'edit'"
                :loading="loading"
                color="primary"
                @click="toggleEdit(true)"
              />
              <q-btn
                v-if="isEditing"
                label="Cancel"
                icon="close"
                color="negative"
                flat
                class="q-ml-sm"
                :loading="loading"
                @click="toggleEdit(false)"
              />
            </div>
          </div>
          
          <q-form @submit="onSubmit" class="q-gutter-y-md">
            <!-- Avatar Section -->
            <div>
              <div class="text-subtitle1 text-white q-mb-sm">Avatar <span class="text-grey-6"></span></div>
              <div class="row items-center q-gutter-x-md">
                <q-avatar size="80px">
                  <q-img :src="avatarUrl" />
                </q-avatar>
                <div>
                  <q-btn
                    flat
                    color="primary"
                    label="Upload file"
                    @click="$refs.avatarInput.click()"
                    :disable="!isEditing"
                  />
                  <q-btn
                    v-if="avatarUrl !== '/placeholder.svg?height=100&width=100'"
                    flat
                    color="grey-6"
                    label="Remove"
                    @click="removeAvatar"
                    :disable="!isEditing"
                  />
                </div>
                <q-file
                  v-model="avatarFile"
                  accept="image/*"
                  style="display: none"
                  ref="avatarInput"
                />
              </div>
            </div>

            <!-- Name Section - First and Last name in same row -->
            <div>
              <div class="text-subtitle1 text-white q-mb-sm">Name</div>
              <div class="row q-col-gutter-md">
                <div class="col-12 col-sm-6">
                  <q-input
                    v-model="firstname"
                    dark
                    outlined
                    label="First name"
                    class="bg-dark"
                    :readonly="!isEditing"
                    :rules="[(val) => !!val || 'First name is required']"
                  />
                </div>
                <div class="col-12 col-sm-6">
                  <q-input
                    v-model="lastname"
                    dark
                    outlined
                    label="Last name"
                    class="bg-dark"
                    :readonly="!isEditing"
                    :rules="[(val) => !!val || 'Last name is required']"
                  />
                </div>
              </div>
            </div>

            <!-- Email Section -->
            <div>
              <div class="text-subtitle1 text-white q-mb-sm">Email</div>
              <q-input
                v-model="email"
                dark
                outlined
                type="email"
                class="bg-dark"
                :readonly="!isEditing"
                :rules="[(val) => !!val || 'Email is required', isValidEmail]"
              />
            </div>

            <!-- Username Section -->
            <div>
              <div class="text-subtitle1 text-white q-mb-sm">Username</div>
              <q-input
                v-model="username"
                dark
                outlined
                class="bg-dark"
                :readonly="!isEditing"
                :rules="[(val) => !!val || 'Username is required']"
              />
            </div>

            <!-- Only show password fields when editing -->
            <template v-if="isEditing">
              <div>
                <div class="text-subtitle1 text-white q-mb-sm">New Password</div>
                <q-input
                  v-model="password"
                  dark
                  outlined
                  type="password"
                  class="bg-dark"
                  :rules="[
                    (val) => !val || val.length >= 8 || 'Password must be at least 8 characters',
                  ]"
                />
              </div>

              <div>
                <div class="text-subtitle1 text-white q-mb-sm">Confirm New Password</div>
                <q-input
                  v-model="confirmPassword"
                  dark
                  outlined
                  type="password"
                  class="bg-dark"
                  :rules="[(val) => !password || val === password || 'Passwords do not match']"
                />
              </div>
            </template>
          </q-form>
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import AppNavbar from '@/components/AppNavbar.vue'
import { ref, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import { apiClient } from '@/plugins/api'

const $q = useQuasar()
const leftDrawerOpen = ref(true)
const loading = ref(false)
const isEditing = ref(false)
const originalData = ref(null)

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

const removeAvatar = () => {
  avatarUrl.value = '/placeholder.svg?height=100&width=100'
  avatarFile.value = null
}

const toggleEdit = async (save = false) => {
  if (isEditing.value && save) {
    await onSubmit()
  } else if (!save) {
    // Restore original data when canceling
    if (originalData.value) {
      email.value = originalData.value.email
      firstname.value = originalData.value.firstname
      lastname.value = originalData.value.lastname
      username.value = originalData.value.username
      avatarUrl.value = originalData.value.avatarUrl || '/placeholder.svg?height=100&width=100'
    }
    password.value = ''
    confirmPassword.value = ''
  }
  isEditing.value = !isEditing.value
}

const onSubmit = async () => {
  try {
    loading.value = true
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
        message: 'Profile updated successfully'
      })
      // Update original data after successful save
      originalData.value = {
        email: email.value,
        firstname: firstname.value,
        lastname: lastname.value,
        username: username.value,
        avatarUrl: avatarUrl.value
      }
      isEditing.value = false
    }
  } catch (error) {
    console.error('Error updating profile:', error)
    $q.notify({
      color: 'negative',
      textColor: 'white',
      icon: 'warning',
      message: 'Failed to update profile'
    })
  } finally {
    loading.value = false
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
    
    // Store original data for cancel functionality
    originalData.value = { ...userData }
  } catch (error) {
    console.error('Error fetching user data:', error)
  }
})
</script>

<style scoped>
.content-width {
  max-width: 800px;
  margin: 0 auto;
}

:deep(.q-field__control) {
  background: #1A1B1E !important;
}

:deep(.q-field--outlined .q-field__control:before) {
  border-color: rgba(255, 255, 255, 0.1);
}s

:deep(.q-field--outlined .q-field__control:hover:before) {
  border-color: rgba(255, 255, 255, 0.2);
}
</style>