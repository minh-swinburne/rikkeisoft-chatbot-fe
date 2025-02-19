<template>
  <q-page padding class="row justify-center items-start q-pa-md" style="max-width: 1000px">
    <div class="col-grow items-center q-mb-lg" style="width: 100%">
      <div class="row q-col-gutter-lg tw:mb-5">
        <div class="col-grow">
          <q-input v-model="searchQuery" label="Search" dense>
            <template #append>
              <q-icon name="search" />
            </template>
          </q-input>
        </div>

        <div class="col-auto">
          <q-btn-dropdown color="primary" label="Filter" icon="filter_list" unelevated>
            <q-card style="min-width: 250px">
              <q-card-section>
                <div class="text-h6">Roles</div>
                <q-toggle
                  v-model="filterRolesMatchAll"
                  label="Match All"
                  color="primary"
                  class="q-my-sm justify-between"
                  style="width: 100%"
                  left-label
                  dense
                />
                <q-select
                  v-model="filterRolesSelected"
                  :options="filterRolesOptions"
                  class="q-mt-sm"
                  multiple
                  outlined
                  dense
                />
              </q-card-section>

              <q-card-actions align="right">
                <q-btn flat label="Clear" @click="clearFilters" />
                <q-btn flat label="Apply" v-close-popup />
              </q-card-actions>
            </q-card>
          </q-btn-dropdown>
        </div>
      </div>

      <q-markup-table v-if="loading" bordered flat>
        <thead>
          <tr>
            <th>
              <q-skeleton animation="blink" width="50px" />
            </th>
            <th>
              <q-skeleton animation="blink" />
            </th>
            <th>
              <q-skeleton animation="blink" />
            </th>
            <th>
              <q-skeleton animation="blink" width="75px" />
            </th>
            <th>
              <q-skeleton animation="blink" />
            </th>
            <th>
              <q-skeleton animation="blink" width="50px" />
            </th>
            <th>
              <q-skeleton animation="blink" width="30px" />
            </th>
            <th>
              <q-skeleton animation="blink" width="75px" />
            </th>
            <th></th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="n in 5" :key="n">
            <td>
              <q-skeleton animation="blink" type="QAvatar" size="30px" class="q-mx-auto" />
            </td>
            <td>
              <q-skeleton animation="blink" type="text" :width="randomWidth(50)" />
            </td>
            <td>
              <q-skeleton animation="blink" type="text" :width="randomWidth(75)" />
            </td>
            <td>
              <q-skeleton animation="blink" type="text" :width="randomWidth(150)" />
            </td>
            <td>
              <q-skeleton animation="blink" type="text" :width="randomWidth(50)" />
            </td>
            <td>
              <q-skeleton animation="blink" type="QChip" width="85px" />
            </td>
            <td>
              <q-skeleton animation="blink" type="text" width="150px" />
            </td>
            <td>
              <q-skeleton animation="blink" type="text" width="100px" />
            </td>
            <td class="q-gutter-x-sm q-mr-md">
              <q-skeleton animation="blink" type="circle" size="35px" class="tw:inline-block" />
              <q-skeleton
                v-if="authStore.isSystemAdmin"
                animation="blink"
                type="circle"
                size="35px"
                class="tw:inline-block"
              />
            </td>
          </tr>
        </tbody>
      </q-markup-table>

      <q-table v-else :rows="filteredUsers" :columns="columns" row-key="id" bordered flat>
        <template #body-cell-avatar="props">
          <q-td>
            <UserAvatar :src="props.row.avatar_url" size="30px" class="q-mx-auto" />
          </q-td>
        </template>

        <template #body-cell-role="props">
          <q-td>
            <q-chip
              v-if="props.row.roles.some((role) => role.name === 'system_admin')"
              color="primary"
              class="text-uppercase text-bold text-white"
              >System Admin</q-chip
            >
            <q-chip
              v-else-if="props.row.roles.some((role) => role.name === 'admin')"
              color="secondary"
              class="text-uppercase text-bold text-white"
              >Admin</q-chip
            >
            <q-chip v-else color="positive" class="text-uppercase text-bold text-white"
              >Employee</q-chip
            >
          </q-td>
        </template>

        <template #body-cell-actions="props">
          <q-td class="q-gutter-x-sm q-mr-md">
            <q-btn
              :to="{ name: 'user-profile', params: { userId: props.row.id } }"
              icon="open_in_new"
              target="_blank"
              fab-mini
            />
            <q-btn
              v-if="authStore.isSystemAdmin"
              color="negative"
              icon="delete"
              fab-mini
              flat
              @click="deleteUser(props.row)"
            />
          </q-td>
        </template>
      </q-table>
    </div>
  </q-page>
</template>

<script setup>
import UserAvatar from '@/components/UserAvatar.vue'
import { apiClient } from '@/plugins/api'
import { useAuthStore } from '@/plugins/stores/auth'
import { date, useQuasar } from 'quasar'
import { computed, onMounted, ref } from 'vue'

const $q = useQuasar()
const authStore = useAuthStore()

const users = ref([])

const loading = ref(true)
const deleting = ref(false)

const searchQuery = ref('')
const filterRolesMatchAll = ref(false)
const filterRolesSelected = ref([])
const filterRolesOptions = ref([
  { label: 'System Admin', value: 'system_admin' },
  { label: 'Admin', value: 'admin' },
  { label: 'Employee', value: 'employee' },
])

const columns = [
  {
    name: 'avatar',
    label: 'Avatar',
    align: 'center',
    field: 'avatar_url',
  },
  { name: 'firstname', label: 'First Name', align: 'left', field: 'firstname', sortable: true },
  {
    name: 'lastname',
    label: 'Last Name',
    align: 'left',
    field: 'lastname',
    sortable: true,
    format: (val) => val || '-',
  },
  { name: 'email', label: 'Email', align: 'left', field: 'email', sortable: true },
  {
    name: 'username',
    label: 'Username',
    align: 'left',
    field: 'username',
    sortable: true,
    format: (val) => val || '-',
  },
  { name: 'role', label: 'Role', align: 'left', field: 'role' },
  {
    name: 'id',
    label: 'ID',
    align: 'left',
    field: 'id',
    style: 'max-width: 160px',
    classes: 'ellipsis',
  },
  {
    name: 'createdTime',
    label: 'Joined',
    align: 'left',
    field: 'created_time',
    sortable: true,
    format: (val) => date.formatDate(val, 'YYYY-MM-DD'),
  },
  {
    name: 'actions',
    align: 'center',
    field: '',
  },
]

const filteredUsers = computed(() => {
  return users.value.filter((user) => {
    const matchesSearch =
      !searchQuery.value ||
      user.firstname.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      user.lastname?.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      user.username?.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      user.id.toString().includes(searchQuery.value.toLowerCase())

    const matchesRoles =
      !filterRolesSelected.value.length ||
      (filterRolesMatchAll.value
        ? filterRolesSelected.value.every((role) =>
            user.roles.map((r) => r.name).includes(role.value),
          )
        : user.roles.some((role) =>
            filterRolesSelected.value.map((r) => r.value).includes(role.name),
          ))

    return matchesSearch && matchesRoles
  })
})

onMounted(() => {
  fetchUsers()
})

function clearFilters() {
  filterRolesMatchAll.value = false
  filterRolesSelected.value = []
}

function randomWidth(bias = 75, weight = 1) {
  return Math.floor(Math.random() * (100 - bias) + bias) * weight + 'px'
}

async function fetchUsers() {
  try {
    const response = await apiClient.users.listUsers()
    users.value = response.data
    loading.value = false
    console.log('Users:', users.value)
  } catch (error) {
    console.error('Error fetching users:', error)
    $q.notify({
      type: 'negative',
      message: 'Failed to fetch users',
    })
  }
}

async function deleteUser(user) {
  $q.dialog({
    title: 'Confirm Deletion',
    message: `Are you sure you want to delete user with ID <a href="/user/profile/${user.id}" target="_blank" class="link tw:underline">${user.id}</a>?`,
    html: true,
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
    deleting.value = true
    try {
      await apiClient.users.deleteUser(user.id)
      users.value = users.value.filter((usr) => usr.id !== user.id)

      $q.notify({
        type: 'positive',
        message: 'Document deleted successfully',
      })
    } catch (error) {
      console.error('Error deleting user:', error)
      $q.notify({
        type: 'negative',
        message: 'Failed to delete user',
      })
    }
    deleting.value = false
  })
}
</script>

<style scoped></style>
