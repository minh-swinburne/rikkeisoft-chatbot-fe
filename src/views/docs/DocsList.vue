<template>
  <q-page padding class="row justify-center items-center q-pa-md" style="max-width: 700px">
    <div class="col-grow q-mb-md items-center" style="width: 100%">
      <div class="row q-col-gutter-lg">
        <div class="col-grow">
          <q-input v-model="searchQuery" label="Search" dense>
            <template #append>
              <q-icon name="search" />
            </template>
          </q-input>
        </div>
        <div class="col-auto">
          <q-btn-dropdown color="primary" label="Filter" icon="filter_list">
            <q-card>
              <q-card-section>
                <div class="text-h6">Filter by Categories</div>
                <q-select v-model="selectedCategories" :options="availableCategories" multiple dense use-chips
                  class="q-mt-sm" />
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
    <q-list v-if="isLoading" class="col-grow rounded-borders" style="width: 100%" bordered separator>
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
    <q-list v-else class="col-grow rounded-borders" bordered separator>
      <q-item v-for="document in paginatedDocuments" :key="document.id" class="q-py-md" style="flex-wrap: wrap">
        <q-item-section class="col-grow q-mt-sm">
          <q-item-label class="text-h6" lines="1">{{ document.title }}</q-item-label>
          <q-item-label caption lines="2">{{ document.description }}</q-item-label>
          <q-item-label>
            <strong>Categories:</strong>
            <q-chip v-for="(category, index) in document.categories" :key="index"
              :color="$q.dark.isActive ? 'grey-9' : 'grey-4'" dense>
              {{ category.name }}
            </q-chip>
          </q-item-label>
          <q-item-label>
            <strong>Created:</strong> {{ formatDate(document.created_date) }}
          </q-item-label>
          <q-item-label>
            <strong>Creator:</strong>
            <q-chip :color="$q.dark.isActive ? 'grey-9' : 'grey-4'" clickable v-ripple
              @click="$router.push(`/profile/${document.creator.id}`)">
              <user-avatar :src="document.creator.avatar_url" alt="Creator Avatar" />
              <!-- <q-avatar>
                    <q-img
                      :src="document.creator.avatar_url"
                      :error-src="`https://cdn.quasar.dev/logo-v2/svg/logo${$q.dark.isActive ? '-dark' : ''}.svg`"
                      alt="Creator Avatar"
                    />
                  </q-avatar> -->
              {{ document.creator.full_name }}
            </q-chip>
          </q-item-label>
          <q-item-label>
            <strong>Access:</strong> {{ document.restricted ? 'Admin Only' : 'Everyone' }}
          </q-item-label>
        </q-item-section>

        <q-item-section class="col-grow q-mt-md">
          <div class="row q-gutter-sm justify-end">
            <q-btn :loading="previewing" color="secondary" icon="visibility" label="Preview" unelevated
              @click="previewDocument(document)" />
            <q-btn :loading="downloading && document == currentDocument" color="positive" icon="download"
              label="Download" unelevated @click="downloadDocument(document)" />
            <q-btn :loading="editting" color="warning" icon="edit" label="Edit" unelevated
              @click="editDocument(document)" />
            <q-btn :loading="deleting" color="negative" icon="delete" label="Delete" unelevated
              @click="deleteDocument(document)" />
          </div>
        </q-item-section>
      </q-item>
    </q-list>

    <div class="justify-center q-mt-md">
      <q-pagination v-model="currentPage" :max="totalPages" :max-pages="5" active-design="unelevated" boundary-links
        direction-links />
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
      <q-card-section>
        <div class="text-h6">Edit Document</div>
      </q-card-section>
      <q-card-section>
        <q-form @submit="submitEditForm">
          <q-input v-model="editFormData.title" label="Title" required />
          <q-input v-model="editFormData.description" type="textarea" label="Description" />
          <q-select v-model="editFormData.categories" :options="availableCategories" label="Categories" multiple>
            <template #selected-item="scope">
              <q-chip v-if="editFormData.categories" removable dense :color="$q.dark.isActive ? 'grey-9' : 'grey-4'"
                @remove="scope.removeAtIndex(scope.index)" :tabindex="scope.tabindex">
                {{ scope.opt }}
              </q-chip>
            </template>
          </q-select>

          <q-option-group v-model="editFormData.restricted" :options="[
            { label: 'Everyone', value: false },
            { label: 'Admin Only', value: true },
          ]" color="secondary" />
          <q-card-actions align="right">
            <q-btn flat label="Cancel" color="secondary" v-close-popup />
            <q-btn flat label="Save Changes" type="submit" color="secondary" />
          </q-card-actions>
        </q-form>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup>
import UserAvatar from '@/components/UserAvatar.vue'
import { apiClient } from '@/plugins/api'
import { useQuasar } from 'quasar'
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

const $q = useQuasar()
const $router = useRouter()

const documents = ref([])
const currentDocument = ref(null)
const previewUrl = ref('')

const previewing = ref(false)
const downloading = ref(false)
const editting = ref(false)
const deleting = ref(false)

const isLoading = ref(true)
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
const selectedCategories = ref([])
const availableCategories = ref([
  'Guidance',
  'Policies',
  'Reports',
  'Procedures',
  'Training Materials',
  'Technical Documentation',
])

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
      doc.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      doc.description.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchesCategories =
      selectedCategories.value.length === 0 ||
      doc.categories.some((cat) => selectedCategories.value.includes(cat))
    return matchesSearch && matchesCategories
  })
})

onMounted(() => {
  fetchDocuments()
})

function clearFilters() {
  selectedCategories.value = []
}

function formatDate(dateString) {
  if (!dateString) return 'Invalid Date'
  const date = new Date(dateString)
  return date.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })
}

async function fetchDocuments() {
  try {
    const response = await apiClient.docs.listDocs()
    documents.value = response.data
    isLoading.value = false
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
    previewing.value = true
    const response = await apiClient.docs.previewDoc(document.id)
    previewUrl.value = response.data.url
    currentDocument.value = document
    showViewer.value = true
    console.log('Preview response:', response)
    console.log('Preview URL:', previewUrl.value)
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
  try {
    const formData = new FormData()
    formData.append('title', editFormData.value.title)
    formData.append('description', editFormData.value.description)
    // formData.append('categories', JSON.stringify(editFormData.value.categories)) // foreach
    formData.append('restricted', editFormData.value.restricted)

    editFormData.value.categories.forEach((category) => {
        formData.append('categories', category)
    })

    await apiClient.docs.editDoc(editFormData.value.id, { id: _, ...editFormData.value })

    isLoading.value = true
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
}

async function downloadDocument(doc) {
  try {
    downloading.value = true
    const response = await apiClient.docs.downloadDoc(doc.id)
    const link = document.createElement('a')
    link.href = response.data.url
    link.setAttribute('download', doc.filename)
    document.body.appendChild(link)
    link.click()
    link.remove()
    downloading.value = false
    $q.notify({
      color: 'positive',
      message: 'Document downloaded successfully',
      icon: 'check',
    })
  } catch (error) {
    console.error('Error downloading document:', error)
    downloading.value = false
    $q.notify({
      color: 'negative',
      message: 'Failed to download document',
      icon: 'report_problem',
    })
  }
}

async function deleteDocument(document) {
  try {
    $q.dialog({
      title: 'Confirm Deletion',
      message: `Are you sure you want to delete "${document.title}"?`,
      cancel: true,
      persistent: true,
    }).onOk(async () => {
      try {
        await apiClient.docs.deleteDoc(document.id)
        documents.value = documents.value.filter((doc) => doc.id !== document.id)

        $q.notify({
          color: 'positive',
          message: 'Document deleted successfully',
          icon: 'check',
        })
      } catch (error) {
        console.error('Error deleting document:', error)
        $q.notify({
          color: 'negative',
          message: 'Failed to delete document',
          icon: 'report_problem',
        })
      }
    })
  } catch (error) {
    if (error) {
      console.error('Error deleting document:', error)
      $q.notify({
        color: 'negative',
        message: 'Failed to delete document',
        icon: 'report_problem',
      })
    }
  }
}
</script>

<style scoped></style>
