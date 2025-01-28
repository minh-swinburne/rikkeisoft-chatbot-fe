<template>
  <q-input
    ref="input"
    v-model="message"
    :dark="$q.dark.isActive"
    :input-style="{ maxHeight: `${maxHeight}px` }"
    placeholder="Ask something..."
    input-class="chat-input q-ml-sm q-py-md"
    outlined
    rounded
    autogrow
    @keydown.enter.prevent="handleEnter"
  >
    <template #append>
      <q-btn @click="sendMessage" icon="send" round flat />
    </template>
  </q-input>
</template>

<script setup>
import { useTemplateRef, onMounted, ref } from 'vue'
import { useQuasar } from 'quasar'

const $q = useQuasar()
const inputRef = useTemplateRef('input')
const message = defineModel()
const emit = defineEmits(['send'])

const maxRows = 5
const maxHeight = ref(100)

function sendMessage() {
  emit('send', message.value)
}

function handleEnter(event) {
  if (!event.shiftKey) {
    // If Enter is pressed without Shift, send the message
    sendMessage()
  } else {
    // If Enter is pressed with Shift, insert a newline
    message.value += '\n'
  }
}

onMounted(() => {
  // console.log(inputRef.value)
  // console.log(getComputedStyle(inputRef.value.$el.control).paddingBottom)
  const style = getComputedStyle(inputRef.value.$el.control)
  maxHeight.value = maxRows * parseInt(style.lineHeight) + parseInt(style.paddingBottom) + parseInt(style.paddingTop)
})
</script>
