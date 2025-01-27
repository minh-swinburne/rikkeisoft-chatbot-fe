import { defineStore } from "pinia";
import { jwtDecode } from "jwt-decode";
import { googleLogout } from "vue3-google-login";
// import { msalInstance } from "@/plugins/config/msalConfig";
import { apiClient } from "@/plugins/api";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: null, // Store user information
  }),

  getters: {
    isAuthenticated: (state) => !!state.user, // Check if the user is authenticated
    isAdmin: (state) => state.user?.roles.includes("admin"), // Check if the user is an admin
  },

  actions: {
    hydrateUser() {
      const accessToken = localStorage.getItem("access_token");
      this.user = accessToken ? jwtDecode(accessToken) : null;
    },

    login(accessToken, refreshToken) {
      localStorage.setItem("access_token", accessToken); // Store the JWT token in localStorage
      localStorage.setItem("refresh_token", refreshToken); // Store the refresh token in
      this.hydrateUser();

      apiClient.client.setToken(accessToken);
    },

    logout() {
      this.user = null; // Clear user information upon logout
      this.accessToken = null;
      this.refreshToken = null;

      googleLogout(); // Logout from Google
      apiClient.client.clearToken();

      // Clear the JWT token from localStorage
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
    },

    async refreshAccess() {
      // Attempt to refresh the token
      try {
        const response = await apiClient.auth.refreshToken();
        const { access_token, refresh_token } = response.data;
        this.login(access_token, refresh_token); // Log in with the new tokens
      } catch (error) {
        console.error("Token refresh failed:", error.response?.data || error);
        this.logout(); // Log out if the token refresh fails
      }
    },
  },
});