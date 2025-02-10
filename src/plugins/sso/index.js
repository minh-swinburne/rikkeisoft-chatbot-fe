import { googleTokenLogin } from 'vue3-google-login'
import { loginRequest, msalInstance } from '@/plugins/sso/msalConfig'
import { apiClient } from '@/plugins/api'

export const ssoProviders = {
  google: {
    name: 'Google',
    logo: 'https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg',
    color: '#4285F4',
    async authenticate() {
      const googleUser = await googleTokenLogin()
      return await apiClient.auth.authenticateGoogle(googleUser.access_token)
    },
    async link() {
      const googleUser = await googleTokenLogin()
      return await apiClient.users.linkSSO("google", { access_token: googleUser.access_token})
    }
  },

  microsoft: {
    name: 'Microsoft',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/2/25/Microsoft_icon.svg',
    color: '#0078D4',
    async authenticate() {
      await msalInstance.initialize()
      const loginResponse = await msalInstance.loginPopup(loginRequest)
      return await apiClient.auth.authenticateMicrosoft(
        loginResponse.accessToken,
        loginResponse.idToken,
      )
    },
    async link() {
      await msalInstance.initialize()
      const loginResponse = await msalInstance.loginPopup(loginRequest)
      return await apiClient.users.linkSSO("microsoft", { access_token: loginResponse.accessToken, id_token: loginResponse.idToken })
    }
  },

  // {
  //   name: 'GitHub',
  //   logo: 'https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg',
  //   color: '#24292E',
  // },
}
