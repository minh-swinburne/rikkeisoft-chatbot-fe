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
            :style="{ borderRadius: '5px', color: 'inherit' }"
            active-class="bg-shadow"
            class="q-ma-sm q-pa-sm"
            clickable
            @click="$router.push('/profile')"
            v-ripple>
            <q-item-section>Profile</q-item-section>
          </q-item>
          
          <q-item
            active
            :style="{ borderRadius: '5px', color: 'inherit' }"
            active-class="bg-shadow"
            class="q-ma-sm q-pa-sm"
            clickable
            @click="$router.push('/sso')"
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
            <h2 class="text-h4 q-mb-lg">Link Your Accounts</h2>
            <q-list bordered separator>
              <q-item>
                <q-item-section avatar>
                    <q-icon
                        name="img:https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                        size="18px"
                        class="q-mr-sm"
                    />
                </q-item-section>
                <q-item-section>
                  <q-item-label>Link with Google</q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-btn
                    :label="googleLinked ? 'Linked' : 'Link'"
                    :color="googleLinked ? 'positive' : 'primary'"
                    :loading="authenticating"
                    @click="GoogleLink"
                  />
                </q-item-section>
              </q-item>
              
              <q-item>
                <q-item-section avatar>
                    <q-icon
                        name="img:https://learn.microsoft.com/en-us/azure/active-directory/develop/media/howto-add-branding-in-azure-ad-apps/ms-symbollockup_mssymbol_19.png"
                        size="18px"
                        class="q-mr-sm"
                    />
                </q-item-section>
                <q-item-section>
                  <q-item-label>Link with Microsoft</q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-btn
                    :label="microsoftLinked ? 'Linked' : 'Link'"
                    :color="microsoftLinked ? 'positive' : 'primary'"
                    :loading="authenticating"
                    @click="MicrosoftLink"
                  />
                </q-item-section>
              </q-item>
            </q-list>
          </div>
        </q-page>
      </q-page-container>
    </q-layout>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  import { useQuasar } from 'quasar'
  import AppNavbar from '@/components/AppNavbar.vue'
  import { apiClient } from '@/plugins/api'
  import { googleTokenLogin } from 'vue3-google-login'
  import { loginRequest, msalInstance } from '@/plugins/sso/msalConfig'
  import { useAuthStore } from '@/plugins/stores/auth'
  
  const $q = useQuasar()
  const leftDrawerOpen = ref(true)
  const googleLinked = ref(false)
  const microsoftLinked = ref(false)
    const authStore = useAuthStore()

const authenticating = ref(false)

  const GoogleLink = async () => {
    authenticating.value = true
    try {
      const googleUser = await googleTokenLogin()
      const response = await apiClient.auth.authenticateGoogle(googleUser.access_token)
      const { access_token, refresh_token } = response.data

      authStore.login(access_token, refresh_token)
      $q.notify({
        color: 'positive',
        message: 'Google account linked successfully',
        icon: 'check',
      })
    } catch (error) {
      console.error('Google link failed', error)
      $q.notify({
        color: 'negative',
        message: 'Failed to link Google account',
        icon: 'report_problem',
     })
    }
    authenticating.value = false
  }
  
  const MicrosoftLink = async () => {
    authenticating.value = true
    try {
      authenticating.value = true
      await msalInstance.initialize()

      const loginResponse = await msalInstance.loginPopup(loginRequest)
      const response = await apiClient.auth.authenticateMicrosoft(
        loginResponse.accessToken,
        loginResponse.idToken,
      )
      const { access_token, refresh_token } = response.data
      authStore.login(access_token, refresh_token)
      $q.notify({
        color: 'positive',
        message: 'Microsoft account linked successfully',
        icon: 'check',
      })
    } catch (error) {
      console.error('Google link failed', error)
      $q.notify({
        color: 'negative',
        message: 'Failed to link Microsoft account',
        icon: 'report_problem',
     })
    }
    authenticating.value = false
  }

  onMounted(async () => {
    const response = await apiClient.users.listSSO()
    const ssoProviders = response.data
    googleLinked.value = ssoProviders.includes('google')
    microsoftLinked.value = ssoProviders.includes('microsoft')
  })

  </script>
  
  <style scoped>
  .content-width {
    max-width: 50%;
    margin: 0 auto;
  }
  </style>