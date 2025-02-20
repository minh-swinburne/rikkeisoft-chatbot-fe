// msalConfig.js
import { PublicClientApplication } from '@azure/msal-browser'

export const msalConfig = {
  auth: {
    clientId: import.meta.env.VITE_MSAL_CLIENT_ID,
    authority: import.meta.env.VITE_MSAL_AUTHORITY,
    redirectUri: import.meta.env.VITE_REDIRECT_URI,
    postLogoutRedirectUri: import.meta.env.VITE_REDIRECT_URI,
  },
  cache: {
    cacheLocation: 'localStorage', // Store tokens in localStorage
    storeAuthStateInCookie: true, // Recommended to avoid issues with older browsers
  },
  system: {
    loggerOptions: {
      loggerCallback: (level, message, containsPii) => {
        if (containsPii) return
        // console.log(level, message)
      },
      logLevel: 'info',
    },
  },
}

export const loginRequest = {
  scopes: ['User.Read', 'openid', 'profile', 'email'], // Scopes requested during login
}

export const msalInstance = new PublicClientApplication(msalConfig)
