<template>
  <q-page padding class="col-grow" style="max-width: 800px">
    <div class="row items-center justify-between q-my-lg">
      <div class="text-h5">Profile Settings</div>
      <div>
        <q-btn
          :label="editing ? 'Apply' : 'Edit'"
          :icon="editing ? 'check' : 'edit'"
          :loading="loading"
          color="primary"
          @click="toggleEdit(true)"
        />
        <q-btn
          v-if="editing"
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

    <q-card flat bordered class="col-grow q-pa-lg">
      <q-form @submit="saveChanges" class="q-gutter-y-sm">
        <!-- Avatar Section -->
        <div class="q-mb-lg">
          <div class="text-subtitle1 q-mb-sm">Avatar <span class="text-grey-6"></span></div>
          <div class="row items-center q-gutter-x-md">
            <UserAvatar :src="avatarUrl" size="80px" bordered />
            <q-card-actions>
              <q-btn
                :disable="!editing"
                label="Upload Image"
                color="secondary"
                icon="upload"
                style="height: 50px; font-size: larger"
                no-caps
                @click="$refs.avatarInput.pickFiles()"
              />
              <q-btn
                v-if="avatarUrl"
                :disable="!editing"
                label="Remove"
                color="grey-6"
                icon="delete"
                style="height: 50px; font-size: larger"
                no-caps
                flat
                @click="removeAvatar"
              />
            </q-card-actions>

            <q-file
              v-model="avatarFile"
              ref="avatarInput"
              accept="image/*"
              style="display: none"
              @update:model-value="previewImage"
            />
          </div>
        </div>

        <!-- Join Date Section -->
        <div class="q-mb-md">
          <div class="text-subtitle1 q-mb-sm">
            Joined Date:
            <span class="text-subtitle2">{{ date.formatDate(joinedDate, 'MMM Do, YYYY') }}</span>
          </div>
        </div>

        <!-- Roles Section -->
        <div class="q-mb-sm">
          <div class="text-subtitle1 q-mb-sm">
            Roles:
            <q-chip
              v-for="role in roles"
              :key="role.id"
              :color="role.name === 'system_admin' ? 'primary' : role.name === 'admin' ? 'secondary' : 'positive'"
              class="text-uppercase text-bold"
            >
              {{ role.name === 'system_admin' ? 'System Admin' : role.name === 'admin' ? 'Admin' : 'Employee' }}
            </q-chip>
          </div>
        </div>

        <!-- Name Section - First and Last name in same row -->
        <div>
          <div class="text-subtitle1 q-mb-sm">Name</div>
          <div class="row q-col-gutter-md">
            <div class="col-12 col-sm-6">
              <q-input
                v-model="firstname"
                label="First name"
                outlined
                required
                autofocus
                :readonly="!editing"
                :rules="[(val) => !!val || 'First name is required']"
              />
            </div>
            <div class="col-12 col-sm-6">
              <q-input v-model="lastname" :readonly="!editing" label="Last name" outlined />
            </div>
          </div>
        </div>

        <!-- Email Section -->
        <div>
          <div class="text-subtitle1 q-mb-sm">Email</div>
          <q-input
            v-model="email"
            type="email"
            outlined
            :readonly="true"
            :rules="[(val) => !!val || 'Email is required', isValidEmail]"
          />
        </div>
      </q-form>
    </q-card>
  </q-page>
</template>

<script setup>
import UserAvatar from '@/components/UserAvatar.vue'
import { apiClient } from '@/plugins/api'
import { useAuthStore } from '@/plugins/stores/auth'
import { useLayoutStore } from '@/plugins/stores/layout'
import { date, useQuasar } from 'quasar'
import { onMounted, ref } from 'vue'

const $q = useQuasar()
const authStore = useAuthStore()
const layoutStore = useLayoutStore()

const loading = ref(false)
const editing = ref(false)

const email = ref('')
const firstname = ref('')
const lastname = ref('')
const joinedDate = ref('')
const avatarUrl = ref('')
const avatarFile = ref(null)
const roles = ref([])

// Load user data when component mounts
onMounted(async () => {
  fetchUser()
})

function isValidEmail(val) {
  const emailPattern =
    /^(?=[a-zA-Z0-9@._%+-]{6,254}$)[a-zA-Z0-9._%+-]{1,64}@(?:[a-zA-Z0-9-]{1,63}\.){1,8}[a-zA-Z]{2,63}$/
  return emailPattern.test(val) || 'Invalid email'
}

async function fetchUser() {
  try {
    const response = await apiClient.users.getCurrentUser()
    const userData = response.data
    email.value = userData.email
    firstname.value = userData.firstname
    lastname.value = userData.lastname
    avatarUrl.value = userData.avatar_url
    roles.value = userData.roles
    joinedDate.value = new Date(userData.created_time.slice(0, 10))

    // console.log(typeof joinedDate.value)
  } catch (error) {
    console.error('Error fetching user profile:', error)
    $q.notify({
      type: 'negative',
      message: 'Failed to fetch user profile',
    })
  }
}

async function toggleEdit(save) {
  if (editing.value && save) {
    await saveChanges()
  } else if (!save) {
    // Restore original data when canceling
    fetchUser()
  }
  editing.value = !editing.value
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
  const url = response.data.url
  if (url && url !== avatarUrl.value) {
    avatarUrl.value = url
  }
  layoutStore.bustAvatarCache()
}

async function removeAvatar() {
  avatarUrl.value = ''
  avatarFile.value = null
}

async function saveChanges() {
  try {
    loading.value = true

    if (avatarFile.value) {
      await uploadAvatar(avatarFile.value)
    } else if (!avatarUrl.value) {
      await apiClient.users.deleteAvatar()
    }

    // console.log(avatarUrl.value)
    const response = await apiClient.users.updateCurrentUser({
      firstname: firstname.value || null,
      lastname: lastname.value || null,
      avatar_url: avatarUrl.value || null,
    })

    const { access_token, refresh_token } = response.data
    authStore.login(access_token, refresh_token)

    $q.notify({
      type: 'positive',
      message: 'Profile updated successfully',
    })
  } catch (error) {
    fetchUser() // Restore original data on error

    console.error('Error updating profile:', error)
    $q.notify({
      type: 'negative',
      message: 'Failed to update profile',
    })
  } finally {
    loading.value = false
  }
}
</script>
