<template>
  <q-layout view="hHh LpR fFf" :class="{ 'bg-dark': $q.dark.isActive }">
    <q-header bordered :class="$q.dark.isActive ? 'bg-dark' : 'bg-primary'">
      <q-toolbar>
        <q-btn
          :icon="$q.dark.isActive ? 'menu' : 'menu'"
          aria-label="Menu"
          flat
          dense
          round
          @click="toggleLeftDrawer"
        />
        <nav-bar />
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      :width="280"
      :class="$q.dark.isActive ? 'bg-dark' : 'bg-grey-2'"
    >
      <q-list>
        <q-item-label header class="flex justify-between items-center">
          Chat History
          <q-btn
            flat
            round
            icon="add"
            size="sm"
            :color="$q.dark.isActive ? 'grey-5' : 'grey-8'"
            @click="createNewChat"
          />
        </q-item-label>
        <q-item
          v-for="chat in sortedChats"
          :key="chat.id"
          :active-class="$q.dark.isActive ? 'bg-grey-9' : 'bg-grey-4'"
          :style="{ borderRadius: '5px' }"
          class="q-ma-sm q-pa-sm"
          clickable
          v-ripple
          @click="$router.push(`/chat/${chat.id}`)"
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
              @click.stop
            >
              <q-list>
                <q-item clickable v-close-popup @click="renameChat(chat)">
                  <q-item-section>Rename</q-item-section>
                </q-item>
                <q-item clickable v-close-popup @click="deleteChat(chat)">
                  <q-item-section>Delete</q-item-section>
                </q-item>
              </q-list>
            </q-btn-dropdown>
          </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view @send="fetchChats" />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useQuasar } from 'quasar';
import { useRouter } from 'vue-router';
import { camelize } from '@/utils';
import { apiClient } from "@/plugins/api";
import { useLayoutStore } from '@/plugins/stores/layout';
import NavBar from '@/components/NavBar.vue';


const $q = useQuasar();
const $router = useRouter();
const layoutStore = useLayoutStore();

const isDark = ref(localStorage.getItem("darkMode") === "true");

const leftDrawerOpen = computed({
  get: () => layoutStore.leftDrawerOpen,
  set: (value) => layoutStore.setLeftDrawerOpen(value)
});

const chats = ref([]);

const sortedChats = computed(() =>
  [...chats.value].sort((a, b) => new Date(b.lastAccess) - new Date(a.lastAccess))
);

async function createNewChat() {
  $router.push('/chat');
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
        await apiClient.chats.renameChat(chat.id, newName);
        await fetchChats();
      } catch (error) {
        $q.notify({
          color: 'negative',
          message: 'Error renaming chat',
          icon: 'error',
        });
      }
    }
  });
}

async function deleteChat(chat) {
  try {
    $q.dialog({
      title: 'Confirm Deletion',
      message: 'Are you sure you want to delete this chat?',
      ok: 'Yes',
      cancel: 'No',
    }).onOk(async () => {
      try {
        await apiClient.chats.deleteChat(chat.id);
        await fetchChats();

        // Check if the current chat's ID is the same as the deleted chat's ID
        if ($router.currentRoute.value.params.chatId === chat.id) {
          await $router.push(`/chat`);
        }
      } catch (deleteError) {
        $q.notify({
          color: 'negative',
          message: 'Error deleting chat',
          icon: 'error',
        });
      }
    });
  } catch (error) {
    $q.notify({
      color: 'negative',
      message: 'Error with the deletion confirmation dialog',
      icon: 'error',
    });
  }
}

async function fetchChats() {
  try {
    const response = await apiClient.chats.listChats();
    chats.value = camelize(response.data);
  } catch (error) {
    $q.notify({
      color: 'negative',
      message: 'Error fetching chats',
      icon: 'error',
    });
  }
}

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value;
}

onMounted(() => {
  fetchChats();
  const savedDarkMode = localStorage.getItem('darkMode')
  if (savedDarkMode !== null) {
    isDark.value = savedDarkMode === 'true'
    $q.dark.set(isDark.value)
    console.log($q.dark)
  }
});
</script>