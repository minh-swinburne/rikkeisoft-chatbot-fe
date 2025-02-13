<template>
  <q-avatar :class="{ bordered: props.bordered }">
    <q-img
      :src="avatarSrc || defaultAvatar"
      :error-src="defaultAvatar"
      :alt="props.alt"
      fit="fill"
      loading-show-delay="1000"
    />
  </q-avatar>
</template>

<script setup>
import defaultAvatar from '@/assets/default_avatar.jpg'
import { useLayoutStore } from '@/plugins/stores/layout'
import { computed } from 'vue'

const props = defineProps(['src', 'alt', 'bordered'])
const layoutStore = useLayoutStore()

const avatarSrc = computed(() => {
  return /^data:image\//.test(props.src) || /^https:\/\/lh3.googleusercontent.com/.test(props.src)
    ? props.src
    : `${props.src}?t=${layoutStore.avatarCacheBust}`
})
</script>

<style lang="scss">
.bordered {
  outline: 1px solid $grey-7;
}
</style>
