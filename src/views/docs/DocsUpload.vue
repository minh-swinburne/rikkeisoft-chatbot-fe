<template>
  <q-page padding class="row col-grow justify-center q-pa-md" style="max-width: 700px">
    <q-card flat bordered class="col-grow q-pa-md">
      <!-- Form Section -->
      <q-form ref="uploadForm" @submit.prevent="submit">
        <!-- Tabs for File or Weblink Upload -->
        <q-tabs v-model="activeTab" class="q-mb-md" active-color="primary">
          <q-tab name="file" label="File Upload" />
          <q-tab name="link" label="Web Link Upload" />
        </q-tabs>

        <q-separator />

        <!-- File / Weblink Input Section -->
        <q-file
          v-if="activeTab === 'file'"
          v-model="file"
          name="file"
          label="Choose File *"
          accept=".pdf, .doc, .docx, .xls, .xlsx"
          class="q-mb-md"
          outlined
          required
          @input="handleFileUpload"
          :rules="[(val) => !!val || 'Field is required']"
        >
          <template #append>
            <q-icon name="attach_file" />
          </template>
        </q-file>

        <q-input
          v-else
          v-model="link"
          name="link"
          label="Enter Weblink *"
          placeholder="https://example.com"
          class="q-mb-md"
          outlined
          required
          :rules="[(val) => !!val || 'Field is required']"
        />

        <!-- Shared Fields Section -->
        <q-input
          v-model="title"
          name="title"
          label="Document Title *"
          class="q-mb-md"
          outlined
          required
          :rules="[(val) => !!val || 'Field is required']"
        />

        <q-input
          v-model="description"
          name="description"
          label="Description"
          type="textarea"
          class="q-mb-md"
          outlined
        />

        <q-select
          v-model="selectedCategories"
          :options="categories"
          name="categories"
          label="Categories *"
          class="q-mb-md"
          type="checkbox"
          multiple
          outlined
          required
          :rules="[(val) => val.length > 0 || 'Field is required']"
        />

        <!-- {{ selectedCategories }} -->

        <q-input
          v-model="createdDate"
          name="createdDate"
          label="Day Created"
          type="date"
          class="q-mb-md"
          outlined
        />

        <q-input
          v-model="creator"
          name="creator"
          label="Creator (Email) *"
          class="q-mb-md"
          outlined
          required
          :rules="[(val) => !!val || 'Field is required']"
        />

        <!-- Access Control Section -->
        <q-item-label class="text-h6">Access Control *</q-item-label>
        <q-option-group
          v-model="restricted"
          :options="accessOptions"
          name="restricted"
          class="q-mb-md"
          inline
        />

        <!-- Submit Button -->
        <q-btn
          :loading="uploading"
          label="Upload"
          color="primary"
          type="submit"
          class="full-width"
        />
      </q-form>
    </q-card>
  </q-page>
</template>

<script setup>
import { apiClient } from '@/plugins/api'
import { useAuthStore } from '@/plugins/stores/auth'
import { useQuasar } from 'quasar'
import { ref } from 'vue'

const $q = useQuasar()
const authStore = useAuthStore()
// const formRef = useTemplateRef("uploadForm"); // Reference to the form element

const uploadForm = ref(null) // Reference to the form element
const activeTab = ref('file') // Default tab is "File Upload"
const file = ref(null)
const link = ref('') // For "Weblink Upload"
const createdDate = ref('') // Default date is today
const creator = ref(authStore.user?.email)
const restricted = ref('admin') // Default access is "Everyone"
const title = ref('') // For "Document Title"
const description = ref('') // For "Description"
const uploading = ref(false) // For loading spinner

const accessOptions = ref([
  {
    label: 'Admin Only',
    value: 'admin',
  },
  {
    label: 'Everyone',
    value: 'all',
  },
])
const categories = ref([
  'Guidance',
  'Policies',
  'Reports',
  'Procedures',
  'Training Materials',
  'Technical Documentation',
])
const selectedCategories = ref([]) // To store the selected categories

function handleFileUpload(event) {
  const uploadedFile = event.target.files[0]

  if (uploadedFile) {
    const date = new Date(uploadedFile.lastModified)
    // console.log(uploadedFile);

    createdDate.value = date.toISOString().slice(0, 10) // Format as DD/MM/YYYY
  }
}

async function submit() {
  const success = await uploadForm.value.validate()
  if (success) {
    uploading.value = true
    console.log('Form submitted successfully!', uploading.value)

    // Construct FormData
    const formData = new FormData()

    // Append form data fields
    if (file.value && activeTab.value === 'file') {
      formData.append('file', file.value)
    } else if (activeTab.value === 'link' && link.value) {
      formData.append('link', link.value)
    }

    formData.append('title', title.value)
    formData.append('description', description.value || '') // Optional
    formData.append('created_date', createdDate.value || new Date().toISOString().slice(0, 10)) // Use today as default
    formData.append('creator', creator.value)
    formData.append('restricted', restricted.value === 'all' ? 'false' : 'true')

    selectedCategories.value.forEach((category) => {
      formData.append('categories', category)
    })

    // Debug FormData entries
    for (let [key, value] of formData.entries()) {
      console.log(`${key}:`, value)
    }

    try {
      const response = await apiClient.docs.uploadDoc(formData)

      console.log('Upload success:', response.data)
      $q.notify({
        type: 'positive',
        message: 'Document uploaded successfully!',
      })
    } catch (error) {
      console.error('Upload failed:', error.response || error)
      if (error.response) {
        console.error('Error details:', error.response.data) // Log error details from server response
      }
      $q.notify({
        type: 'negative',
        message: 'An error occurred while uploading the document.',
      })
    } finally {
      uploading.value = false
    }
  } else {
    $q.notify({
      type: 'negative',
      message: 'Please fill in all required fields.',
    })
  }
}
</script>

<style scoped></style>
