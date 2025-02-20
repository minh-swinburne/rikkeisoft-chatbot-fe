<template>
    <q-btn
      flat
      round
      dense
      icon="content_copy"
      :color="$q.dark.isActive ? 'grey-5' : 'grey-7'"
      class="message-copy-btn"
      @click="copyToClipboard"
    >
      <q-tooltip>Copy message</q-tooltip>
    </q-btn>
  </template>
  
  <script setup>
  import { useQuasar } from 'quasar'
  
  const $q = useQuasar()
  const props = defineProps({
    content: {
      type: String,
      required: true
    }
  })
  
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(props.content)
      $q.notify({
        type: 'positive',
        message: 'Message copied to clipboard',
      })
    } catch (err) {
      $q.notify({
        type: 'negative',
        message: 'Failed to copy message',
      })
    }
  }
  </script>
  
  <style scoped>
  .message-copy-btn {
    opacity: 0;
    transition: opacity 0.2s ease;
  }
  
  .q-message:hover .message-copy-btn {
    opacity: 1;
  }
  </style>