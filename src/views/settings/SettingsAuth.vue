<template>
  <q-page padding class="col-grow q-col-gutter-lg" style="max-width: 700px">
    <section>
      <div class="row items-center justify-between q-my-lg">
        <h2 class="text-h5 q-my-none">Authentication Settings</h2>
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

      <q-card flat bordered class="col-grow q-pa-md">
        <q-form ref="updateForm" @submit="saveChanges">
          <!-- User ID Section -->
          <q-card-section class="q-mb-xs">
            <div class="text-subtitle1">ID</div>
            <q-input
              v-model="authStore.user.sub"
              :type="showUserId ? 'text' : 'password'"
              readonly
              outlined
            >
              <template #append>
                <q-icon
                  :name="showUserId ? 'visibility' : 'visibility_off'"
                  class="cursor-pointer"
                  @click="showUserId = !showUserId"
                />
              </template>
            </q-input>
          </q-card-section>

          <!-- Username Section -->
          <q-card-section class="q-pb-none">
            <div class="text-subtitle1">Username</div>
            <q-input
              v-model="newUsername"
              maxlength="20"
              counter
              outlined
              :readonly="!editing"
              :rules="editing ? usernameRules : []"
            />
          </q-card-section>

          <!-- Password Section -->
          <q-card-section class="q-pb-none">
            <div class="text-subtitle1 q-mb-sm">Current Password</div>
            <q-input
              v-model="oldPassword"
              autocomplete="off"
              type="Password"
              outlined
              :readonly="!editing"
              :rules="editing ? oldPasswordRules : []"
            />
          </q-card-section>

          <q-card-section class="q-pb-none">
            <div class="text-subtitle1 q-mb-sm">New Password</div>
            <q-input
              v-model="newPassword"
              autocomplete="new-password"
              type="Password"
              outlined
              :readonly="!editing"
              :rules="editing ? newPasswordRules : []"
            >
              <template #append v-if="editing">
                <q-icon
                  :name="showPwd ? 'visibility' : 'visibility_off'"
                  class="cursor-pointer"
                  @click="showPwd = !showPwd"
                />
              </template>
            </q-input>
          </q-card-section>

          <q-card-section>
            <div class="text-subtitle1 q-mb-sm">Confirm New Password</div>
            <q-input
              v-model="confirmPassword"
              autocomplete="new-password"
              type="Password"
              outlined
              :readonly="!editing"
              :rules="editing ? confirmPasswordRules : []"
            />
          </q-card-section>
        </q-form>
      </q-card>
    </section>

    <section>
      <div class="row items-center justify-between q-my-lg">
        <h3 class="text-h5 q-my-none">Link Your Accounts</h3>
      </div>

      <q-card flat bordered class="col-grow q-pa-lg">
        <q-card-section>
          <div class="text-h6">Single Sign-On</div>
          <div class="text-subtitle1">Link your account with these services</div>
        </q-card-section>

        <q-card-section>
          <q-list bordered separator>
            <q-item v-for="(provider, key) in ssoProviders" :key="key">
              <q-item-section avatar>
                <q-icon :name="`img:${provider.logo}`" size="24px" class="q-mr-sm" />
              </q-item-section>
              <q-item-section>
                <q-item-label
                  >{{ provider.name }}
                  <span v-if="linkedProviders[key]" class="text-caption text-italic"
                    >({{ censorEmail(linkedProviders[key].email) }})</span
                  ></q-item-label
                >
              </q-item-section>
              <q-item-section side>
                <q-btn
                  :loading="loading"
                  :label="linkedProviders[key] ? 'Linked' : 'Link'"
                  :color="linkedProviders[key] ? 'positive' : 'primary'"
                  :icon-right="linkedProviders[key] ? 'task_alt' : 'link'"
                  unelevated
                  @click="toggleSSO(key)"
                />
              </q-item-section>
            </q-item>
          </q-list>
        </q-card-section>
      </q-card>
    </section>

    <section class="q-mb-lg">
      <div class="row items-center justify-between q-my-lg">
        <h3 :class="$q.dark.isActive ? 'text-red' : 'text-negative'" class="text-h5 q-my-none">
          Delete Account
        </h3>
      </div>

      <q-card flat bordered class="col-grow q-pa-lg border-negative">
        <q-card-section>
          <div class="text-subtitle1">
            Once you delete your account, all your chats will be completely deleted, but the
            documents you uploaded will remain. This action cannot be undone.
          </div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn label="Delete Account" color="negative" unelevated @click="deleteAccount" />
        </q-card-actions>
      </q-card>
    </section>
  </q-page>
</template>

<script setup>
import { apiClient } from '@/plugins/api'
import { ssoProviders } from '@/plugins/sso/index'
import { useAuthStore } from '@/plugins/stores/auth'
import { censorEmail } from '@/utils'
import { useQuasar } from 'quasar'
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

const $q = useQuasar()
const $router = useRouter()
const authStore = useAuthStore()

const updateForm = ref(null)
const loading = ref(false)
const editing = ref(false)
const showPwd = ref(false)
const showUserId = ref(false)

const username = ref('')
const newUsername = ref('')
const oldPassword = ref('')
const newPassword = ref('')
const confirmPassword = ref('')
const usernameLastChanged = ref(null)
const userSSO = ref([])

const usernameRules = [
  (val) => !!val || 'Username is required',
  (val) => val.length >= 3 || 'Username must be at least 3 characters',
  (val) => val.length <= 20 || 'Username must be at most 20 characters',
  () =>
    username.value === newUsername.value ||
    !usernameLastChanged.value ||
    usernameChangedDelta.value >= 30 ||
    'You can only change your username once in 30 days. Last change was ' + usernameChangedDelta.value + ' days ago',
]

const oldPasswordRules = [(val) => !!val || !username.value || 'Current password required']

const newPasswordRules = [
  (val) => !!val || (username.value && username.value !== newUsername.value) || 'New password required',
  (val) => !val || val.length >= 8 || 'Password must be at least 8 characters',
  (val) => val !== oldPassword.value || 'New password cannot be the same as old password',
]

const confirmPasswordRules = [
  (val) => !!val || !newPassword.value || 'Confirm new password required',
  (val) => val === newPassword.value || 'Passwords do not match',
]

const usernameChangedDelta = computed(() => {
  if (!usernameLastChanged.value) return null
  const delta = new Date() - usernameLastChanged.value
  return Math.floor(delta / (1000 * 60 * 60 * 24))
})

const linkedProviders = computed(() => {
  return userSSO.value.reduce((acc, sso) => {
    acc[sso.provider] = sso
    return acc
  }, {})
})

// Load user data when component mounts
onMounted(async () => {
  await fetchUser()
  // console.log(userSSO.value)
})

async function fetchUser() {
  try {
    const userResponse = await apiClient.users.getCurrentUser()
    const ssoResponse = await apiClient.users.listSSO()

    username.value = userResponse.data.username
    newUsername.value = userResponse.data.username
    userSSO.value = ssoResponse.data
    oldPassword.value = ''
    newPassword.value = ''
    confirmPassword.value = ''

    usernameLastChanged.value = userResponse.data.username_last_changed
      ? new Date(userResponse.data.username_last_changed)
      : null
  } catch (error) {
    console.error('Error fetching account settings:', error)
    $q.notify({
      type: 'negative',
      message: 'Failed to fetch account settings',
    })
  }
}

async function toggleEdit(save) {
  if (editing.value && save) {
    await saveChanges()
  } else if (!save) {
    // Restore original data when canceling
    fetchUser()
    updateForm.value.resetValidation()
  }
  editing.value = !editing.value
}

async function toggleSSO(provider) {
  loading.value = true
  if (linkedProviders.value[provider]) {
    // Unlink account
    $q.dialog({
      title: 'Unlink Account',
      message: 'Are you sure you want to unlink this account?',
      persistent: true,
      ok: {
        color: 'negative',
        label: 'Unlink',
        unelevated: true,
        iconRight: 'link_off',
      },
      cancel: {
        color: $q.dark.isActive ? 'white' : 'black',
        label: 'Cancel',
        flat: true,
      },
    }).onOk(async () => {
      try {
        if (userSSO.value.length === 1 && !username.value) {
          throw new Error('You cannot unlink last account without username')
        }
        await apiClient.users.unlinkSSO(provider)
        userSSO.value = userSSO.value.filter((sso) => sso.provider !== provider)

        $q.notify({
          type: 'positive',
          message: 'Account unlinked successfully',
        })
      } catch (error) {
        console.error('Error unlinking account:', error.response?.data?.detail || error.message)
        $q.notify({
          type: 'negative',
          message: error.response?.data?.detail || error.message || 'Failed to unlink account',
        })
      } finally {
        loading.value = false
      }
    })
  } else {
    try {
      // Link account
      const response = await ssoProviders[provider].link()
      userSSO.value.push(response.data)

      console.log('Account linked:', userSSO.value)
      $q.notify({
        type: 'positive',
        message: 'Account linked successfully',
      })
    } catch (error) {
      console.error('Error linking account:', error.response?.data?.detail)
      $q.notify({
        type: 'negative',
        message: error.response?.data?.detail || 'Failed to link account',
      })
    } finally {
      loading.value = false
    }
  }
}

async function saveChanges() {
  const formValid = await updateForm.value.validate()
  if (!formValid) {
    editing.value = false // This will be toggled back to true
    $q.notify({
      type: 'negative',
      message: 'Please fill in all required fields',
    })
    return
  }
  try {
    loading.value = true

    const response = await apiClient.users.updateCurrentUser({
      username: newUsername.value || null,
      old_password: oldPassword.value || null,
      new_password: newPassword.value || null,
    })

    const { access_token, refresh_token } = response.data
    authStore.login(access_token, refresh_token)

    $q.notify({
      type: 'positive',
      message: 'Account updated successfully',
    })
  } catch (error) {
    fetchUser() // Restore original data on error

    console.error('Error updating account:', error)
    $q.notify({
      type: 'negative',
      message: error.response?.data?.detail || 'Failed to update profile',
    })
  } finally {
    loading.value = false
  }
}

async function deleteAccount() {
  $q.dialog({
    title: 'Delete Account',
    message: 'Are you sure you want to delete your account?',
    persistent: true,
    ok: {
      color: 'negative',
      label: 'Delete',
      unelevated: true,
      icon: 'delete',
    },
    cancel: {
      color: $q.dark.isActive ? 'white' : 'black',
      label: 'Cancel',
      flat: true,
    },
  }).onOk(async () => {
    try {
      await apiClient.users.deleteCurrentUser()
      authStore.logout()
      $router.push('/')

      $q.notify({
        type: 'positive',
        message: 'Account deleted successfully',
      })
    } catch (error) {
      console.error('Error deleting account:', error)
      $q.notify({
        type: 'negative',
        message: 'Failed to delete account',
      })
    }
  })
}
</script>
