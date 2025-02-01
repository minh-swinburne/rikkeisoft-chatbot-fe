import { defineStore } from 'pinia'
import { useDark } from '@vueuse/core'
import { ref } from 'vue'

export const useLayoutStore = defineStore('layout', () => {
  const leftDrawerOpen = ref(false)
  const isDark = useDark({ storageKey: 'color-scheme' })

  function setLeftDrawerOpen(value) {
    leftDrawerOpen.value = value
  }

  function toggleLeftDrawer() {
    leftDrawerOpen.value = !leftDrawerOpen.value
  }

  return {
    leftDrawerOpen,
    isDark,
    setLeftDrawerOpen,
    toggleLeftDrawer,
  }
})
