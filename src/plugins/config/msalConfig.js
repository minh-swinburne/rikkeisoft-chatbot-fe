// msalConfig.js
import { PublicClientApplication } from "@azure/msal-browser";

export const msalConfig = {
  auth: {
    clientId: "c89161ba-67a4-49c0-99a0-49dd53feda18",
    authority: "https://login.microsoftonline.com/common", // Default authority
    redirectUri: window.location.origin,
    postLogoutRedirectUri: window.location.origin,
  },
  cache: {
    cacheLocation: "localStorage", // Store tokens in localStorage
    storeAuthStateInCookie: true, // Recommended to avoid issues with older browsers
  },
  system: {
    loggerOptions: {
      loggerCallback: (level, message, containsPii) => {
        if (containsPii) return;
        console.log(level, message);
      },
      logLevel: "info",
    },
  },
};

export const loginRequest = {
  scopes: ["openid", "profile", "email"], // Scopes requested during login
};

export const msalInstance = new PublicClientApplication(msalConfig);