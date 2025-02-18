<template>
  <q-page padding class="col-grow q-px-md q-py-xl q-mx-auto" :style="{ maxWidth: `min(100%, ${ $q.screen.gt.sm ? '1000px' : '666px' })` }">
    <!-- Main content wrapper -->
    <div class="row q-col-gutter-lg">
      <!-- Left column - Avatar section -->
      <div class="col-12 col-md-3">
        <div class="text-center">
          <UserAvatar :src="avatarUrl" size="200px" bordered class="profile-avatar" />

          <div class="text-h6 q-mt-md">{{ firstname }} {{ lastname }}</div>

          <div class="text-subtitle2 text-grey-7">{{ email }}</div>

          <div class="text-subtitle2 text-grey-7 q-my-sm">
            <q-icon name="calendar_today" size="xs" class="q-mr-xs" />
            <span>Joined {{ date.formatDate(joinedDate, 'MMMM D, YYYY') }}</span>
          </div>

          <q-chip v-if="roles.some((role) => role.name === 'system_admin')" color="primary" class="text-uppercase text-bold">System Admin</q-chip>
          <q-chip v-else-if="roles.some((role) => role.name === 'admin')" color="secondary" class="text-uppercase text-bold">Admin</q-chip>
          <q-chip v-else color="positive" class="text-uppercase text-bold">Employee</q-chip>
        </div>
      </div>

      <!-- Right column - Profile info and Document List -->
      <div class="col-12 col-md-9">
        <!-- Profile Info Card -->
        <q-card flat bordered class="q-mb-md">
          <q-card-section>
            <q-form class="q-gutter-y-sm">
              <!-- Name Section - First and Last name in same row -->
              <div>
                <div class="text-subtitle1 q-mb-sm">Name</div>
                <div class="row q-col-gutter-md">
                  <div class="col-12 col-sm-6">
                    <q-input
                      v-model="firstname"
                      label="First name"
                      outlined
                      required
                      autofocus
                      :readonly="true"
                    />
                  </div>
                  <div class="col-12 col-sm-6">
                    <q-input v-model="lastname" label="Last name" outlined :readonly="true" />
                  </div>
                </div>
              </div>

              <!-- Email Section -->
              <div>
                <div class="text-subtitle1 q-mb-sm">Email</div>
                <q-input v-model="email" type="email" outlined :readonly="true" />
              </div>
            </q-form>
          </q-card-section>
        </q-card>

        <!-- Document List Card -->
        <q-card flat bordered>
          <q-card-section>
            <div class="text-h6">Documents</div>
          </q-card-section>

          <q-card-section class="q-pt-none">
            <q-list separator>
              <q-item class="q-pa-md" v-for="document in documents" :key="document.id">
                <q-item-section>
                  <q-item-label>{{ document.title }}</q-item-label>
                  <q-item-label caption>{{ document.description }}</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import UserAvatar from '@/components/UserAvatar.vue'
import { apiClient } from '@/plugins/api'
import { date, useQuasar } from 'quasar'
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'

const $route = useRoute()
const $q = useQuasar()
const userId = $route.params.userId

const email = ref('')
const firstname = ref('')
const lastname = ref('')
const joinedDate = ref('')
const avatarUrl = ref('')
const roles = ref([])
const documents = ref([])

onMounted(async () => {
  await fetchUser()
  await fetchDocuments()
})

async function fetchUser() {
  try {
    const response = await apiClient.users.getUser(userId)
    const userData = response.data

    email.value = userData.email
    firstname.value = userData.firstname
    lastname.value = userData.lastname
    avatarUrl.value = userData.avatar_url
    roles.value = userData.roles
    joinedDate.value = new Date(userData.created_time.slice(0, 10))
  } catch (error) {
    console.error('Error fetching user profile:', error)
    $q.notify({
      type: 'negative',
      message: 'Failed to fetch user profile',
    })
  }
}

async function fetchDocuments() {
  try {
    const response = await apiClient.users.listDocsByUser(userId)
    documents.value = response.data
  } catch (error) {
    console.error('Error fetching documents:', error)
    $q.notify({
      type: 'negative',
      message: 'Failed to fetch documents',
    })
  }
}
</script>

<style scoped>
.profile-card {
  background: var(--q-primary-fade);
}

@media (max-width: 1023px) {
  .profile-avatar {
    max-width: 200px;
  }
}
</style>
