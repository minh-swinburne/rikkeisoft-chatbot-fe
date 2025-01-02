import { defineStore } from "pinia";

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
    },
  },
});