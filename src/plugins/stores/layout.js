import { defineStore } from 'pinia'
import { useDark } from '@vueuse/core'
import { ref } from 'vue'

export const useLayoutStore = defineStore('layout', () => {
  const leftDrawerOpen = ref(false)
  const avatarCacheBust = ref(Date.now())
  const isDark = useDark({ storageKey: 'color-scheme' })

  function setLeftDrawerOpen(value) {
    leftDrawerOpen.value = value
  }

  function toggleLeftDrawer() {
    leftDrawerOpen.value = !leftDrawerOpen.value
  }

  function bustAvatarCache() {
    avatarCacheBust.value = Date.now()
  }

  return {
    leftDrawerOpen,
    avatarCacheBust,
    isDark,
    setLeftDrawerOpen,
    toggleLeftDrawer,
    bustAvatarCache,
  }
})
