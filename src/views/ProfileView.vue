<template>
  <q-layout view="hHh LpR fFf">
    <q-header bordered>
      <q-toolbar>
        <app-navbar />
      </q-toolbar>
    </q-header>

    <!-- Left Sidebar -->
    <q-drawer v-model="leftDrawerOpen" show-if-above bordered :width="280">
      <q-list padding>
        <q-item-label header>Settings</q-item-label>

        <q-item
          active
          :style="{ borderRadius: '5px', color: 'inherit' }"
          active-class="bg-shadow"
          class="q-ma-sm q-pa-sm"
          clickable
          @click="$router.push('/profile')"
          v-ripple
        >
          <q-item-section>Profile</q-item-section>
        </q-item>

        <q-item
          :style="{ borderRadius: '5px', color: 'inherit' }"
          active-class="bg-shadow"
          class="q-ma-sm q-pa-sm"
          clickable
          @click="$router.push('/sso')"
          v-ripple
        >
          <q-item-section>Authentication</q-item-section>
        </q-item>

        <q-item
          :style="{ borderRadius: '5px', color: 'inherit' }"
          active-class="bg-shadow"
          class="q-ma-sm q-pa-sm"
          clickable
          v-ripple
        >
          <q-item-section>Organizations</q-item-section>
        </q-item>

        <q-item
          :style="{ borderRadius: '5px', color: 'inherit' }"
          active-class="bg-shadow"
          class="q-ma-sm q-pa-sm"
          clickable
          v-ripple
        >
          <q-item-section>Billing</q-item-section>
        </q-item>

        <q-item
          :style="{ borderRadius: '5px', color: 'inherit' }"
          active-class="bg-shadow"
          class="q-ma-sm q-pa-sm"
          clickable
          v-ripple
        >
          <q-item-section>Access Tokens</q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container>
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

          <q-form @submit="saveChanges" class="q-gutter-y-md">
            <!-- Avatar Section -->
            <div>
              <div class="text-subtitle1 text-white q-mb-sm">
                Avatar <span class="text-grey-6"></span>
              </div>
              <div class="row items-center q-gutter-x-md">
                <user-avatar :src="avatarUrl" size="80px" bordered />
                <div>
                  <q-btn
                    flat
                    label="Upload Image"
                    @click="$refs.avatarInput.pickFiles()"
                    no-caps
                    :disable="!isEditing"
                    style="height: 50px; font-size: larger"
                  />
                  <q-btn
                    v-if="avatarUrl"
                    flat
                    color="grey-6"
                    label="Remove"
                    @click="removeAvatar"
                    no-caps
                    :disable="!isEditing"
                    style="height: 50px; font-size: larger"
                  />
                </div>
                <q-file
                  v-model="avatarFile"
                  accept="image/*"
                  style="display: none"
                  ref="avatarInput"
                  @update:model-value="previewImage"
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
                    label="First name"
                    outlined
                    autofocus
                    :readonly="!isEditing"
                    :rules="[(val) => !!val || 'First name is required']"
                  />
                </div>
                <div class="col-12 col-sm-6">
                  <q-input
                    v-model="lastname"
                    label="Last name"
                    outlined
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
                type="email"
                outlined
                :readonly="true"
                :rules="[(val) => !!val || 'Email is required', isValidEmail]"
              />
            </div>

            <div class="text-h4 text-white">Account Settings</div>

            <!-- Username Section -->
            <div>
              <div class="text-subtitle1 text-white q-mb-sm">Username</div>
              <q-input
                v-model="username"
                outlined
                :readonly="!isEditing"
                :rules="[(val) => !!val || 'Username is required']"
              />
            </div>

            <!-- Only show Password fields when editing -->

            <template v-if="isEditing">
              <div>
                <div class="text-subtitle1 text-white q-mb-sm">Old Password</div>
                <q-input
                  v-model="oldPassword"
                  autocomplete="off"
                  outlined
                  type="Password"
                  :rules="[(val) => !!val || !newPassword || 'Old password required']"
                />
              </div>
              <div>
                <div class="text-subtitle1 text-white q-mb-sm">New Password</div>
                <q-input
                  v-model="newPassword"
                  autocomplete="new-password"
                  outlined
                  type="Password"
                  :rules="[
                    (val) => !!val || !oldPassword || 'New password required',
                    (val) => val.length >= 8 || 'Password must be at least 8 characters',
                  ]"
                />
              </div>

              <div>
                <div class="text-subtitle1 text-white q-mb-sm">Confirm New Password</div>
                <q-input
                  v-model="confirmnewPassword"
                  autocomplete="new-password"
                  outlined
                  type="Password"
                  :rules="[
                    (val) => !!val || !newPassword || 'Confirm new password required',
                    (val) => val === newPassword || 'Passwords do not match',
                  ]"
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
import UserAvatar from '@/components/UserAvatar.vue'
import { apiClient } from '@/plugins/api'
import { useAuthStore } from '@/plugins/stores/auth'
import { useQuasar } from 'quasar'
import { onMounted, ref } from 'vue'

const $q = useQuasar()
const authStore = useAuthStore()

const leftDrawerOpen = ref(true)
const loading = ref(false)
const isEditing = ref(false)
const originalData = ref(null)

const email = ref('')
const firstname = ref('')
const lastname = ref('')
const username = ref('')
const oldPassword = ref('')
const newPassword = ref('')
const confirmnewPassword = ref('')
const avatarUrl = ref('')
const avatarFile = ref(null)

function isValidEmail(val) {
  const emailPattern =
    /^(?=[a-zA-Z0-9@._%+-]{6,254}$)[a-zA-Z0-9._%+-]{1,64}@(?:[a-zA-Z0-9-]{1,63}\.){1,8}[a-zA-Z]{2,63}$/
  return emailPattern.test(val) || 'Invalid email'
}

function removeAvatar() {
  avatarUrl.value = ''
  avatarFile.value = null
}

function resetData() {
  // Restore original data when canceling
  if (originalData.value) {
    email.value = originalData.value.email
    firstname.value = originalData.value.firstname
    lastname.value = originalData.value.lastname
    username.value = originalData.value.username
    avatarUrl.value = originalData.value.avatar_url
  }
  newPassword.value = ''
  confirmnewPassword.value = ''
}

async function toggleEdit(save = false) {
  if (isEditing.value && save) {
    await saveChanges()
  } else if (!save) {
    // Restore original data when canceling
    resetData()
  }
  isEditing.value = !isEditing.value
}

function previewImage(file) {
  if (file) {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => {
      avatarUrl.value = reader.result
    }
  }
}

async function uploadAvatar(file) {
  const response = await apiClient.users.uploadAvatar(file)
  return response.data.url
}

async function saveChanges() {
  try {
    loading.value = true
    const url = await uploadAvatar(avatarFile.value)
    if (url && url !== avatarUrl.value) {
      avatarUrl.value = url
    }
    console.log(avatarUrl.value)
    const response = await apiClient.users.updateCurrentUser({
      firstname: firstname.value,
      lastname: lastname.value,
      username: username.value,
      old_password: oldPassword.value,
      new_password: newPassword.value,
      avatar_url: avatarUrl.value,
    })

    const { access_token, refresh_token } = response.data
    authStore.login(access_token, refresh_token)
    isEditing.value = false

    $q.notify({
      color: 'positive',
      textColor: 'white',
      icon: 'cloud_done',
      message: 'Profile updated successfully',
    })

    // Update original data after successful save
    originalData.value = {
      email: email.value,
      firstname: firstname.value,
      lastname: lastname.value,
      username: username.value,
      avatarUrl: avatarUrl.value,
    }
  } catch (error) {
    isEditing.value = false
    resetData()

    console.error('Error updating profile:', error)
    $q.notify({
      color: 'negative',
      textColor: 'white',
      icon: 'warning',
      message: 'Failed to update profile',
    })
  } finally {
    loading.value = false
  }
}

// Load user data when component mounts
onMounted(async () => {
  try {
    const response = await apiClient.users.getCurrentUser()
    const userData = response.data
    email.value = userData.email
    firstname.value = userData.firstname
    lastname.value = userData.lastname
    username.value = userData.username
    avatarUrl.value = userData.avatar_url

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
</style>
