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
      :class="$q.dark.isActive ? 'bg-dark' : 'bg-grey-1'"
    >
      <q-list>
        <q-item-label header>Chat History</q-item-label>
        <q-item
          v-for="chat in sortedChats"
          :key="chat.id"
          :to="`/chat/${chat.id}`"
          clickable
          v-ripple
        >
          <q-item-section>
            <q-item-label>{{ chat.name }}</q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-btn-dropdown flat dense size="sm">
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
      <q-space />
      <q-item>
        <q-btn :color="$q.dark.isActive ? 'grey-8' : 'primary'" class="full-width" @click="createNewChat">
          + New Chat
        </q-btn>
      </q-item>
      <q-item>
        <q-btn color="negative" class="full-width" @click="logout">
          Logout
        </q-btn>
      </q-item>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useQuasar } from 'quasar';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { useLayoutStore } from '@/stores/layout';
import NavBar from '@/components/NavBar.vue';
import axios from 'axios';
import { camelize } from '@/utils';

const $q = useQuasar();
const $router = useRouter();
const authStore = useAuthStore();
const layoutStore = useLayoutStore();

const leftDrawerOpen = computed({
  get: () => layoutStore.leftDrawerOpen,
  set: (value) => layoutStore.setLeftDrawerOpen(value)
});

const chats = ref([]);

const sortedChats = computed(() =>
  [...chats.value].sort((a, b) => new Date(b.lastAccess) - new Date(a.lastAccess))
);

async function createNewChat() {
  try {
    const response = await axios.post('http://127.0.0.1:8000/api/v1/chats', {
      name: 'New Chat',
      user_id: authStore.user.sub,
    });
    const newChat = camelize(response.data);
    chats.value.push(newChat);
    await fetchChats();
    $router.push(`/chat/${newChat.id}`);
  } catch (error) {
    $q.notify({
      color: 'negative',
      message: 'Error creating new chat',
      icon: 'error',
    });
  }
}


async function renameChat(chat) {
  const newName = await $q.dialog({
    title: 'Rename Chat',
    message: 'Enter new chat name:',
    prompt: {
      model: chat.name,
      type: 'text',
    },
    cancel: true,
    persistent: true,
  });

  if (newName && newName !== chat.name) {
    try {
      await axios.put(`http://127.0.0.1:8000/api/v1/chats/${chat.id}/rename`, {
        name: newName,
        user_id: authStore.user.sub,
      });
      await fetchChats();
    } catch (error) {
      $q.notify({
        color: 'negative',
        message: 'Error renaming chat',
        icon: 'error',
      });
    }
  }
}

async function deleteChat(chat) {
  try {
    await $q.dialog({
      title: 'Confirm Deletion',
      message: 'Are you sure you want to delete this chat?',
      ok: 'Yes',
      cancel: 'No',
    });

    await axios.delete(`http://127.0.0.1:8000/api/v1/chats/${chat.id}/delete`);
    await fetchChats();
  } catch (error) {
    if (error) {
      $q.notify({
        color: 'negative',
        message: 'Error deleting chat',
        icon: 'error',
      });
    }
  }
}

async function fetchChats() {
  try {
    const response = await axios.get('http://127.0.0.1:8000/api/v1/chats', {
      params: { user_id: authStore.user.sub },
    });
    chats.value = camelize(response.data);
  } catch (error) {
    $q.notify({
      color: 'negative',
      message: 'Error fetching chats',
      icon: 'error',
    });
  }
}

function logout() {
  authStore.logout();
  $router.push('/login');
}

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value;
}

onMounted(() => {
  fetchChats();
  $q.dark.set(true); // Set dark mode as default
});
</script>
