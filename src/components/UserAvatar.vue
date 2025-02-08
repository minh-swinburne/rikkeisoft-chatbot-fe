<template>
  <q-avatar :class="{ bordered: props.bordered }">
    <q-img
      :src="props.src || defaultAvatar"
      :error-src="defaultAvatar"
      :alt="props.alt"
      loading-show-delay="1000"
    />
  </q-avatar>
</template>

<script setup>
import defaultAvatar from '@/assets/default_avatar.jpg'

const props = defineProps(['src', 'alt', 'bordered'])

// console.log('Avatar source:', props.src)
</script>

<style lang="scss">
.bordered {
  outline: 1px solid $grey-7;
}
</style>
