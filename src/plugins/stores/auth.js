import { apiClient } from '@/plugins/api'
import { useStorage } from '@vueuse/core'
import { jwtDecode } from 'jwt-decode'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { googleLogout } from 'vue3-google-login'

export const useAuthStore = defineStore('auth', () => {
  // **State**
  const accessToken = useStorage('access-token', null)
  const refreshToken = useStorage('refresh-token', null)
  const user = ref(accessToken.value ? jwtDecode(accessToken.value) : null)

  // **Getters**
  const isAuthenticated = computed(() => !!user.value)
  const isAdmin = computed(() => user.value?.roles.includes('admin'))

  // **Actions**
  function hydrateUser() {
    user.value = accessToken.value ? jwtDecode(accessToken.value) : null
  }

  function login(newAccessToken, newRefreshToken) {
    accessToken.value = newAccessToken
    refreshToken.value = newRefreshToken
    hydrateUser()
    apiClient.client.setToken(newAccessToken)
  }

  function logout() {
    user.value = null
    accessToken.value = null
    refreshToken.value = null

    googleLogout()
    apiClient.client.clearToken()
  }

  async function validateAccess() {
    const hasToken = !!accessToken.value && !!refreshToken.value

    if (!hasToken) {
      console.warn('No token found. User is not logged in.')
      return false
    }

    try {
      if (!apiClient.client.getToken()) {
        apiClient.client.setToken(accessToken.value)
      }
      const response = await apiClient.auth.validateToken()
      return response.data.valid
    } catch (error) {
      console.error('Token validation failed:', error.response?.data || error)
      return false
    }
  }

  async function refreshAccess() {
    try {
      const response = await apiClient.auth.refreshToken()
      const { access_token, refresh_token } = response.data
      login(access_token, refresh_token)
    } catch (error) {
      console.error('Token refresh failed:', error.response?.data || error)
      logout()
    }
  }

  return {
    user,
    accessToken,
    refreshToken,
    isAuthenticated,
    isAdmin,
    hydrateUser,
    login,
    logout,
    validateAccess,
    refreshAccess,
  }
})
