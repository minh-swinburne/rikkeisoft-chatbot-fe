<template>
  <!--
  General description:
  This component provides a button to copy a message to the clipboard with visual feedback.

  Methods:
  - copyToClipboard: Copies the provided content to the clipboard and shows a notification.
  -->
  <q-btn
    :color="$q.dark.isActive ? 'grey-5' : 'grey-7'"
    icon="content_copy"
    class="chat-copy-btn"
    size="sm"
    round
    flat
    @click="copyToClipboard"
  >
    <q-tooltip anchor="top middle" self="bottom middle" :offset="[10, 5]">Copy message</q-tooltip>
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
  } catch (error) {
    console.error('Error copying message:', error)
    $q.notify({
      type: 'negative',
      message: 'Failed to copy message',
    })
  }
}
</script>

<style scoped>
.chat-copy-btn {
  opacity: 0;
  transition: opacity 0.2s ease;
}

.q-message:hover .chat-copy-btn {
  opacity: 1;
}
</style>
