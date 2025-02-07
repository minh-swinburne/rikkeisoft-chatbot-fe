<template>
  <q-layout view="hHh LpR fFf">
    <q-header bordered>
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
                    label="Upload Image"
                    @click="$refs.avatarInput.pickFiles()"
                    no-caps
                    :disable="!isEditing"
                    style="height: 50px; font-size: larger;"
                  />
                  <q-btn
                    v-if="avatarUrl !== '/src/assets/default_avatar.jpg'"
                    flat
                    color="grey-6"
                    label="Remove"
                    @click="removeAvatar"
                    no-caps
                    :disable="!isEditing"
                    style="height: 50px; font-size: larger;"
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
                    outlined
                    autofocus
                    label="First name"
                    :readonly="!isEditing"
                    :rules="[(val) => !!val || 'First name is required']"
                  />
                </div>
                <div class="col-12 col-sm-6">
                  <q-input
                    v-model="lastname"
                    outlined
                    autofocus
                    label="Last name"
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
                outlined
                autofocus
                type="email"
                :readonly="true"
                :rules="[(val) => !!val || 'Email is required', isValidEmail]"
              />
            </div>

            <!-- Username Section -->
            <div>
              <div class="text-subtitle1 text-white q-mb-sm">Username</div>
              <q-input
                v-model="username"
                outlined
                autofocus
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
                  outlined
                  autofocus
                  type="Password"
                  :rules="[
                    (val) => (!val && !newPassword) || 'Old password required',
                  ]"
                />
              </div>
              <div>
                <div class="text-subtitle1 text-white q-mb-sm">New Password</div>
                <q-input
                  v-model="newPassword"
                  outlined
                  autofocus
                  type="Password"
                  :rules="[
                    (val) => (!val && !oldPassword) || val.length >= 8 || 'Password must be at least 8 characters',
                  ]"
                />
              </div>

              <div>
                <div class="text-subtitle1 text-white q-mb-sm">Confirm New Password</div>
                <q-input
                  v-model="confirmnewPassword"
                  outlined
                  autofocus
                  type="Password"
                  :rules="[(val) => (!val && !newPassword) || val === newPassword || 'Passwords do not match']"
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
import { useAuthStore } from '@/plugins/stores/auth'
import { apiClient } from '@/plugins/api'

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
const avatarUrl = ref('/src/assets/default_avatar.jpg')
const avatarFile = ref(null)


const isValidEmail = (val) => {
  const emailPattern =
    /^(?=[a-zA-Z0-9@._%+-]{6,254}$)[a-zA-Z0-9._%+-]{1,64}@(?:[a-zA-Z0-9-]{1,63}\.){1,8}[a-zA-Z]{2,63}$/
  return emailPattern.test(val) || 'Invalid email'
}

const removeAvatar = () => {
  avatarUrl.value = '/src/assets/default_avatar.jpg'
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
      avatarUrl.value = originalData.value.avatar_url || '/src/assets/default_avatar.jpg'
    }
    newPassword.value = ''
    confirmnewPassword.value = ''
  }
  isEditing.value = !isEditing.value
}

const previewImage = (file) => {
  if (file) {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      avatarUrl.value = reader.result;
    };
  }
};

const uploadAvatar = async (file) => {
  const response = await apiClient.users.uploadAvatar(file)
  return response.data.url
}


const onSubmit = async () => {
  try {
    loading.value = true
    avatarUrl.value = await uploadAvatar(avatarFile.value)
    console.log(avatarUrl.value)
    const response = await apiClient.users.updateCurrentUser({
      firstname: firstname.value,
      lastname: lastname.value,
      username: username.value,
      old_password: oldPassword.value,
      new_password: newPassword.value,
      avatar_url: avatarUrl.value
    })

    const { access_token, refresh_token } = response.data
    authStore.login(access_token, refresh_token)
    isEditing.value = false

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
  } catch (error) {
    isEditing.value = false
    console.error('Error updating profile:', error)
    $q.notify({
      color: 'negative',
      textColor: 'white',
      icon: 'warning',
      message: 'Failed to update profile'
    })
    if (originalData.value) {
      email.value = originalData.value.email
      firstname.value = originalData.value.firstname
      lastname.value = originalData.value.lastname
      username.value = originalData.value.username
      avatarUrl.value = originalData.value.avatar_url || '/src/assets/default_avatar.jpg'
    }
    newPassword.value = ''
    confirmnewPassword.value = ''
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
    avatarUrl.value = userData.avatar_url || '/src/assets/default_avatar.jpg'
    
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