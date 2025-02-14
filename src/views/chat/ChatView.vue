<template>
  <q-layout view="hHh LpR fFf">
    <q-header bordered>
      <q-toolbar>
        <q-btn icon="menu" aria-label="Menu" flat dense round @click="toggleLeftDrawer" />
        <AppNavbar />
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered :width="280">
      <q-list>
        <q-item-label header class="flex justify-between items-center">
          Chat History
          <q-btn
            :color="$q.dark.isActive ? 'grey-5' : 'grey-8'"
            icon="add"
            size="sm"
            flat
            round
            @click="createNewChat"
          />
        </q-item-label>
        <q-item
          v-for="chat in chats"
          :key="chat.id"
          :style="{ borderRadius: '5px', color: 'inherit' }"
          :to="{ name: 'chat-detail', params: { chatId: chat.id } }"
          active-class="bg-shadow-2"
          class="q-ma-sm q-pa-sm"
          clickable
          v-ripple
        >
          <q-item-section>
            <q-item-label lines="1">{{ chat.name }}</q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-btn-dropdown
              dropdown-icon="more_horiz"
              size="sm"
              flat
              dense
              rounded
              no-icon-animation
              @click.stop.prevent
            >
              <q-list>
                <q-item clickable v-close-popup @click.stop="renameChat(chat)">
                  <q-item-section>Rename</q-item-section>
                </q-item>
                <q-item clickable v-close-popup @click.stop="deleteChat(chat)">
                  <q-item-section>Delete</q-item-section>
                </q-item>
              </q-list>
            </q-btn-dropdown>
          </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view @send="fetchChats" @rename="generateName" />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import AppNavbar from '@/components/AppNavbar.vue'
import { apiClient } from '@/plugins/api'
import { useLayoutStore } from '@/plugins/stores/layout'
import { camelize } from '@/utils'
import { useQuasar } from 'quasar'
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

const $q = useQuasar()
const $router = useRouter()
const layoutStore = useLayoutStore()

const chats = ref([])

const leftDrawerOpen = computed({
  get: () => layoutStore.leftDrawerOpen,
  set: (value) => layoutStore.setLeftDrawerOpen(value),
})

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value
}

function sortChats() {
  console.log('Sorting chats...')
  chats.value.sort((a, b) => new Date(b.lastAccess) - new Date(a.lastAccess))
  // console.log(chats.value);
}

async function createNewChat() {
  $router.push('/chat')
}

async function fetchChats() {
  try {
    const response = await apiClient.chats.listChats()
    chats.value = camelize(response.data)
    sortChats()
  } catch (error) {
    console.error('Error fetching chats:', error)
    $q.notify({
      type: 'negative',
      message: 'Error fetching chats',
    })
  }
}

async function generateName(chatId) {
  const index = chats.value.findIndex((chat) => chat.id === chatId)
  console.log('Generating new chat name...')
  console.log(chats.value[index])

  try {
    const confResponse = await apiClient.config.checkStream('name_generation')
    const streaming = confResponse.data
    const nameResponse = await apiClient.chats.getNewName(chatId)

    if (streaming) {
      console.log('Streaming new name...')

      const reader = nameResponse.body.getReader()
      const decoder = new TextDecoder('utf-8')
      const delay = 100

      let newName = ''
      let done = false

      while (!done) {
        const { value, done: streamDone } = await reader.read()
        if (streamDone) break

        let chunk = decoder.decode(value, { stream: true })
        chunk = chunk.replace(/(\r\n|\n|\r)/gm, '') // Remove newlines
        chunk = chunk.replace(/"*/g, '') // Remove quotes

        newName += chunk
        done = streamDone
        chats.value[index].name = newName
        await new Promise((resolve) => setTimeout(resolve, delay))
      }

      console.log('Streaming completed.')
      console.log(newName)
    } else {
      console.log('Non-streaming response received.')
      // console.log(chats.value[0] === chats.value[index]);
      const responseData = await nameResponse.json()
      chats.value[index].name = responseData.name
    }
  } catch (error) {
    console.error('Error generating new chat name:', error)
    $q.notify({
      color: 'negative',
      message: 'An error occurred while generating new chat name.',
      icon: 'error',
    })
  }
}

async function renameChat(chat) {
  $q.dialog({
    title: 'Rename Chat',
    message: 'Enter new chat name:',
    prompt: {
      model: chat.name,
      type: 'text',
    },
    cancel: true,
    persistent: true,
  }).onOk(async (newName) => {
    if (newName && newName !== chat.name) {
      try {
        await apiClient.chats.renameChat(chat.id, newName)
        await fetchChats()

        $q.notify({
          color: 'positive',
          message: 'Chat renamed successfully',
          icon: 'check_circle',
        })
      } catch (error) {
        console.log('Error renaming chat:', error)
        $q.notify({
          color: 'negative',
          message: 'Error renaming chat',
          icon: 'error',
        })
      }
    }
  })
}

async function deleteChat(chat) {
  try {
    $q.dialog({
      title: 'Confirm Deletion',
      message: 'Are you sure you want to delete this chat?',
      ok: {
        color: 'negative',
        label: 'Yes',
        unelevated: true,
      },
      cancel: {
        color: $q.dark.isActive ? 'white' : 'black',
        label: 'No',
        flat: true,
      },
    }).onOk(async () => {
      try {
        await apiClient.chats.deleteChat(chat.id)
        await fetchChats()

        // Check if the current chat's ID is the same as the deleted chat's ID
        if ($router.currentRoute.value.params.chatId === chat.id) {
          await $router.push(`/chat`)
        }

        $q.notify({
          color: 'positive',
          message: 'Chat deleted successfully',
          icon: 'check_circle',
        })
      } catch (deleteError) {
        console.error('Error deleting chat:', deleteError)
        $q.notify({
          color: 'negative',
          message: 'Error deleting chat',
          icon: 'error',
        })
      }
    })
  } catch (error) {
    console.error('Error with the deletion confirmation dialog:', error)
    $q.notify({
      color: 'negative',
      message: 'Error with the deletion confirmation dialog',
      icon: 'error',
    })
  }
}

onMounted(() => {
  fetchChats()
})
</script>
