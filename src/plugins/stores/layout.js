import { defineStore } from 'pinia'

export const useLayoutStore = defineStore('layout', {
  state: () => ({
    leftDrawerOpen: false,
  }),

  actions: {
    setLeftDrawerOpen(value) {
      this.leftDrawerOpen = value
    },
    toggleLeftDrawer() {
      this.leftDrawerOpen = !this.leftDrawerOpen
    },
  },
})
