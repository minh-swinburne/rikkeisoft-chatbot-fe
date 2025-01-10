import { defineStore } from "pinia";
import { googleLogout } from "vue3-google-login";

export const useAuthStore = defineStore("user", {
  state: () => ({
    user: null, // Store user information
  }),
  actions: {
    login(user) {
      this.user = user; // Set user information upon login
    },
    logout() {
      this.user = null; // Clear user information upon logout
      // Clear the JWT token from localStorage
      localStorage.removeItem("jwt");
      googleLogout();
    },
  },
});