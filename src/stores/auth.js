import axios from "axios";
import { defineStore } from "pinia";
import { jwtDecode } from "jwt-decode";
import { googleLogout } from "vue3-google-login";

export const useAuthStore = defineStore("user", {
  state: () => ({
    user: null, // Store user information
  }),
  actions: {
    login(accessToken, refreshToken) {
      // const match = document.cookie.match(/access_token=([^;]+)/);
      // const token = match ? match[1] : null; // Get the JWT token from cookies
      console.log(accessToken);
      const user = jwtDecode(accessToken); // Decode the JWT token
      this.user = user; // Set user information upon login
      this.accessToken = accessToken; // Save access token
      this.refreshToken = refreshToken; // Save refresh token
      localStorage.setItem("access_token", accessToken); // Store the JWT token in localStorage
      localStorage.setItem("refresh_token", refreshToken); // Store the refresh token in
      // Set the Authorization header for all requests
      axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
    },
    logout() {
      this.user = null; // Clear user information upon logout
      this.accessToken = null;
      this.refreshToken = null;
      // Clear the JWT token from localStorage
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      googleLogout(); // Logout from Google
    },
    async refreshToken() {
      // Attempt to refresh the token
      try {
        const response = await axios.post(
          "http://localhost:8000/api/v1/auth/refresh",
          null,
          {
            withCredentials: true,
          }
        );
        const { access_token, refresh_token } = response.data;
        this.login(access_token, refresh_token); // Log in with the new tokens
      } catch (error) {
        console.error("Token refresh failed:", error.response?.data || error);
        this.logout(); // Log out if the token refresh fails
      }
    },
  },
});