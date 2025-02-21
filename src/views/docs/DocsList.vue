<template>
  <!--
  General description:
  This component displays a list of documents with search and filter functionalities. It allows users to preview, download, edit, and delete documents.

  Methods:
  - clearFilters: Clears all applied filters.
  - fetchDocuments: Fetches the list of documents from the server.
  - previewDocument: Previews a document.
  - editDocument: Opens the edit form for a document.
  - submitEditForm: Submits the edit form and updates the document.
  - downloadDocument: Downloads a document.
  - deleteDocument: Deletes a document.
  -->
  <q-page padding class="row justify-center items-start q-pa-md" style="max-width: 700px">
    <div class="col-grow items-center q-mb-lg" style="width: 100%">
      <div class="row q-col-gutter-lg">
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
                <div class="text-h6">Categories</div>
                <q-toggle
                  v-model="filterCatMatchAll"
                  label="Match All"
                  color="primary"
                  class="q-my-sm justify-between"
                  style="width: 100%"
                  left-label
                  dense
                />
                <q-select
                  v-model="filterCatSelected"
                  :options="availableCategories"
                  class="q-mt-sm"
                  multiple
                  filled
                  dense
                >
                  <template #selected-item="scope">
                    <q-chip
                      v-if="editFormData.categories"
                      class="bg-shadow"
                      removable
                      dense
                      @remove="scope.removeAtIndex(scope.index)"
                      :tabindex="scope.tabindex"
                    >
                      {{ scope.opt }}
                    </q-chip>
                  </template>
                </q-select>
              </q-card-section>

              <q-card-section class="q-py-none">
                <div class="text-h6">Creator</div>
                <q-input v-model="filterCreator" class="q-mt-sm" filled dense />
              </q-card-section>

              <q-card-section>
                <div class="text-h6">Access</div>
                <q-select
                  v-model="filterAccess"
                  :options="[
                    { label: 'Everyone', value: false },
                    { label: 'Admin Only', value: true },
                  ]"
                  color="primary"
                  class="q-mt-sm"
                  clearable
                  filled
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
    </div>

    <!-- LOADING SKELETONS -->
    <q-list v-if="loading" class="col-grow rounded-borders" style="width: 100%" bordered separator>
      <q-item v-for="i in itemsPerPage" :key="i" class="q-py-md column">
        <q-item-section class="col-grow q-mt-sm">
          <q-skeleton type="rect" width="100%" />
          <q-skeleton type="text" width="80%" class="q-mb-xs" />

          <q-item-label class="flex" style="gap: 10px">
            <q-skeleton type="QBadge" />
            <q-skeleton type="QChip" height="100%" />
            <q-skeleton type="QChip" height="100%" />
          </q-item-label>

          <q-item-label class="flex" style="gap: 10px; height: 18px">
            <q-skeleton type="QBadge" />
            <q-skeleton type="text" width="40%" />
          </q-item-label>

          <q-item-label class="flex" style="gap: 10px">
            <q-skeleton type="QBadge" />
            <q-skeleton type="QChip" height="100%" />
          </q-item-label>

          <q-item-label class="flex" style="gap: 10px; height: 18px">
            <q-skeleton type="QBadge" />
            <q-skeleton type="text" width="30%" />
          </q-item-label>
        </q-item-section>

        <q-item-section class="col-grow q-mt-md">
          <div class="row q-gutter-sm justify-end">
            <q-skeleton type="QBtn" />
            <q-skeleton type="QBtn" />
            <q-skeleton type="QBtn" />
            <q-skeleton type="QBtn" />
          </div>
        </q-item-section>
      </q-item>
    </q-list>

    <!-- ACTUAL DOCUMENT LIST -->
    <q-list v-else-if="totalPages > 0" class="col-grow rounded-borders" bordered separator>
      <q-item
        v-for="document in paginatedDocuments"
        :key="document.id"
        class="q-py-md"
        style="flex-wrap: wrap"
      >
        <q-item-section class="col-grow q-mt-sm" style="width: 100%">
          <q-item-label class="text-h6" lines="1">{{ document.title }}</q-item-label>

          <q-item-label caption lines="2" class="q-mb-sm">{{ document.description }}</q-item-label>

          <q-item-label class="q-mb-xs">
            <strong>ID: </strong>
            <span class="text-caption">{{ document.id }}</span>
          </q-item-label>

          <q-item-label class="q-mb-xs">
            <strong>Type: </strong>
            <span>{{ document.file_type }}</span>
          </q-item-label>

          <q-item-label class="q-mb-xs">
            <strong>Categories:</strong>
            <q-chip
              v-for="(category, index) in document.categories"
              :key="index"
              class="bg-shadow"
              dense
            >
              {{ category.name }}
            </q-chip>
          </q-item-label>

          <q-item-label class="q-mb-xs">
            <strong>Created on:</strong>
            {{ date.formatDate(document.created_date, 'MMM Do, YYYY (ddd)') }}
          </q-item-label>

          <q-item-label>
            <strong>Creator:</strong>
            <q-chip class="bg-shadow" clickable v-ripple>
              <router-link
                :to="{ name: 'user-profile', params: { userId: document.creator_user.id } }"
                class="row items-center"
              >
                <UserAvatar :src="document.creator_user.avatar_url" alt="Creator Avatar" />
                {{ document.creator_user.full_name }}
              </router-link>
            </q-chip>
          </q-item-label>

          <q-item-label class="q-mb-sm">
            <strong>Last Modified:</strong>
            {{ date.formatDate(document.last_modified, 'MMM Do, YYYY (ddd), HH:mm ([GMT] Z)') }}
          </q-item-label>

          <q-item-label>
            <strong>Access:</strong> {{ document.restricted ? 'Admin Only' : 'Everyone' }}
          </q-item-label>
        </q-item-section>

        <q-item-section class="col-grow q-mt-md">
          <div class="row q-gutter-sm justify-end">
            <q-btn
              :loading="previewing"
              color="secondary"
              icon="visibility"
              label="Preview"
              unelevated
              @click="previewDocument(document)"
            />
            <q-btn
              v-if="authorized"
              :loading="downloading && document == currentDocument"
              color="positive"
              icon="download"
              label="Download"
              unelevated
              @click="downloadDocument(document)"
            />
            <q-btn
              v-if="authorized"
              color="warning"
              icon="edit"
              label="Edit"
              unelevated
              @click="editDocument(document)"
            />
            <q-btn
              v-if="authorized"
              :loading="deleting && document == currentDocument"
              color="negative"
              icon="delete"
              label="Delete"
              unelevated
              @click="deleteDocument(document)"
            />
          </div>
        </q-item-section>
      </q-item>
    </q-list>

    <h4 v-else class="text-center">No documents found</h4>

    <div class="justify-center q-mt-md">
      <q-pagination
        v-if="totalPages > 0"
        v-model="currentPage"
        :max="totalPages"
        :max-pages="5"
        active-design="unelevated"
        boundary-links
        direction-links
      />
    </div>
  </q-page>

  <q-dialog v-model="showViewer">
    <q-card style="width: 90vw; max-width: 1000px">
      <q-card-section class="row items-center q-pb-none q-mb-md">
        <div class="text-h6">{{ currentDocument.title }} - Preview</div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>

      <q-card-section class="q-pa-none q-mb-lg" align="center">
        <iframe :src="previewUrl" style="width: 90%; height: 550px" />
      </q-card-section>
    </q-card>
  </q-dialog>

  <q-dialog v-model="showEditForm">
    <q-card style="width: 500px; max-width: 90vw">
      <q-card-section class="q-pb-none">
        <div class="text-h6">Edit Document</div>
      </q-card-section>
      <q-card-section>
        <q-form class="q-gutter-md" @submit="submitEditForm">
          <q-input v-model="editFormData.title" label="Title" filled required />
          <q-input v-model="editFormData.description" type="textarea" label="Description" filled />
          <q-select
            v-model="editFormData.categories"
            :options="availableCategories"
            label="Categories"
            use-chips
            multiple
            filled
          />

          <q-option-group
            v-model="editFormData.restricted"
            :options="[
              { label: 'Everyone', value: false },
              { label: 'Admin Only', value: true },
            ]"
            color="primary"
          />
          <q-card-actions align="right">
            <q-btn label="Cancel" icon="close" color="negative" flat v-close-popup />
            <q-btn
              :loading="editting"
              label="Save Changes"
              icon="check"
              type="submit"
              color="primary"
              unelevated
            />
          </q-card-actions>
        </q-form>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup>
import UserAvatar from '@/components/UserAvatar.vue'
import { apiClient } from '@/plugins/api'
import { useAuthStore } from '@/plugins/stores/auth'
import _ from 'lodash'
import { date, useQuasar } from 'quasar'
import { computed, onMounted, ref } from 'vue'

const $q = useQuasar()
const authStore = useAuthStore()

const documents = ref([])
const currentDocument = ref(null)
const previewUrl = ref('')

const previewing = ref(false)
const downloading = ref(false)
const editting = ref(false)
const deleting = ref(false)

const loading = ref(true)
const currentPage = ref(1)
const itemsPerPage = 5

const showViewer = ref(false)
const showEditForm = ref(false)
const editFormData = ref({
  id: '',
  title: '',
  description: '',
  categories: [],
  restricted: false,
})

const searchQuery = ref('')
const filterCatMatchAll = ref(false)
const filterCatSelected = ref([])
const filterCreator = ref('')
const filterAccess = ref(null)

const availableCategories = ref([
  'Guidance',
  'Policies',
  'Reports',
  'Procedures',
  'Training Materials',
  'Technical Documentation',
])

const authorized = computed(() => {
  return authStore.isAdmin || authStore.isSystemAdmin
})

const totalPages = computed(() => {
  return Math.ceil(filteredDocuments.value.length / itemsPerPage)
})

const paginatedDocuments = computed(() => {
  const startIndex = (currentPage.value - 1) * itemsPerPage
  return filteredDocuments.value.slice(startIndex, startIndex + itemsPerPage)
})

const filteredDocuments = computed(() => {
  return documents.value.filter((doc) => {
    const matchesSearch =
      !searchQuery.value ||
      doc.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      doc.description.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      doc.id.includes(searchQuery.value.toLowerCase())

    const matchesCategories =
      filterCatSelected.value.length === 0 ||
      (filterCatMatchAll.value
        ? filterCatSelected.value.every((category) =>
            doc.categories.map((cat) => cat.name).includes(category),
          )
        : doc.categories.some((cat) => filterCatSelected.value.includes(cat.name)))

    const matchesCreator = doc.creator_user.full_name
      .toLowerCase()
      .includes(filterCreator.value.toLowerCase())
    const matchesAccess = filterAccess.value ? filterAccess.value.value === doc.restricted : true

    return matchesSearch && matchesCategories && matchesCreator && matchesAccess
  })
})

onMounted(() => {
  fetchDocuments()
})

function clearFilters() {
  filterCatMatchAll.value = false
  filterCatSelected.value = []
  filterCreator.value = ''
  filterAccess.value = null
}

async function fetchDocuments() {
  try {
    const response = await apiClient.docs.listDocs()
    documents.value = response.data
    loading.value = false
    // console.log('Documents:', documents.value)
  } catch (error) {
    console.error('Error fetching documents:', error)
    $q.notify({
      color: 'negative',
      message: 'Failed to fetch documents',
      icon: 'report_problem',
    })
  }
}

async function previewDocument(document) {
  try {
    if (document.link_url) {
      // Open external link in new tab
      window.open(document.link_url, '_blank')
      return
    }
    previewing.value = true
    const response = await apiClient.docs.previewDoc(document.id)
    previewUrl.value = response.data.url
    currentDocument.value = document
    showViewer.value = true
    // console.log('Preview response:', response)
    // console.log('Preview URL:', previewUrl.value)
    previewing.value = false
  } catch (error) {
    console.error('Error previewing document:', error)
    previewing.value = false
    $q.notify({
      color: 'negative',
      message: 'Failed to preview document',
      icon: 'report_problem',
    })
  }
}

function editDocument(document) {
  editFormData.value = {
    id: document.id,
    title: document.title || '',
    description: document.description || '',
    categories: Array.isArray(document.categories)
      ? document.categories.map((cat) => cat.name)
      : document.categories
        ? [document.categories.name]
        : [],
    restricted: document.restricted || false,
  }
  showEditForm.value = true
}

async function submitEditForm() {
  editting.value = true
  try {
    await apiClient.docs.editDoc(editFormData.value.id, { ...editFormData.value, id: _ })

    showEditForm.value = false
    loading.value = true
    fetchDocuments()

    $q.notify({
      color: 'positive',
      message: 'Document updated successfully',
      icon: 'check',
    })
  } catch (error) {
    console.error('Error updating document:', error)
    $q.notify({
      color: 'negative',
      message: 'Failed to update document',
      icon: 'report_problem',
    })
  }
  editting.value = false
}

async function downloadDocument(doc) {
  downloading.value = true
  try {
    const response = await apiClient.docs.downloadDoc(doc.id)
    const link = document.createElement('a')

    link.href = response.data.url
    link.setAttribute('download', doc.filename)
    document.body.appendChild(link)
    link.click()
    link.remove()

    $q.notify({
      color: 'positive',
      message: 'Document downloaded successfully',
      icon: 'check',
    })
  } catch (error) {
    console.error('Error downloading document:', error)
    $q.notify({
      color: 'negative',
      message: 'Failed to download document',
      icon: 'report_problem',
    })
  }
  downloading.value = false
}

async function deleteDocument(document) {
  $q.dialog({
    title: 'Confirm Deletion',
    message: `Are you sure you want to delete "${document.title}"?`,
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
    currentDocument.value = document
    try {
      await apiClient.docs.deleteDoc(document.id)
      documents.value = documents.value.filter((doc) => doc.id !== document.id)

      $q.notify({
        type: 'positive',
        message: 'Document deleted successfully',
      })
    } catch (error) {
      console.error('Error deleting document:', error)
      $q.notify({
        type: 'negative',
        message: 'Failed to delete document',
      })
    }
    deleting.value = false
  })
}
</script>

<style scoped></style>
