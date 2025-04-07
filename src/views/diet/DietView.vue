<template>
  <q-page padding class="row justify-center q-pa-md">
    <q-card flat bordered class="col-12 col-md-8 q-pa-lg">
      <q-form @submit.prevent="submitImage">
        <h5 class="text-center q-mb-lg">Food Object Detection</h5>

        <!-- Tabs for Upload or URL -->
        <q-tabs v-model="activeTab" active-color="primary">
          <q-tab name="upload" label="Upload Image" />
          <q-tab name="url" label="Paste Image URL" />
        </q-tabs>

        <q-separator class="q-my-md" />

        <!-- Image Upload -->
        <q-file
          v-if="activeTab === 'upload'"
          v-model="imageFile"
          label="Choose or Drop Image"
          accept="image/*"
          filled
          class="q-mb-md"
          @update:model-value="previewImage"
        >
          <template #append>
            <q-icon name="attach_file" />
          </template>
        </q-file>

        <!-- Image URL -->
        <q-input
          v-else
          v-model="imageUrl"
          label="Paste Image URL"
          placeholder="https://example.com/image.jpg"
          filled
          class="q-mb-md"
          @blur="previewImage"
        />

        <!-- Image Preview -->
        <div v-if="previewSrc" class="q-mb-md text-center">
          <img :src="previewSrc" alt="Preview" style="max-width: 100%; max-height: 300px; margin: auto;" />
        </div>

        <!-- Submit Button -->
        <q-btn
          :loading="loading"
          label="Detect Food"
          color="primary"
          type="submit"
          class="full-width"
        />
      </q-form>

      <!-- Annotated Image -->
      <div v-if="annotatedImage" class="q-mt-lg text-center">
        <h6>Annotated Image</h6>
        <img :src="annotatedImage" alt="Annotated" style="max-width: 100%; max-height: 400px" />
      </div>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import { useQuasar } from 'quasar'
import { apiClient } from '@/plugins/api'

const $q = useQuasar()

const activeTab = ref('upload')
const imageFile = ref(null)
const imageUrl = ref('')
const previewSrc = ref('')
const annotatedImage = ref('')
const loading = ref(false)

function previewImage() {
  console.log('Previewing image...')
  if (activeTab.value === 'upload' && imageFile.value) {
    const reader = new FileReader()
    reader.onload = (e) => (previewSrc.value = e.target.result)
    reader.readAsDataURL(imageFile.value)
  } else if (activeTab.value === 'url') {
    previewSrc.value = imageUrl.value
  }
}

async function submitImage() {
  if (!previewSrc.value) {
    $q.notify({ type: 'negative', message: 'Please provide an image.' })
    return
  }

  loading.value = true
  const formData = new FormData()

  if (activeTab.value === 'upload' && imageFile.value) {
    formData.append('file', imageFile.value)
  } else if (activeTab.value === 'url') {
    formData.append('url', imageUrl.value)
  }

  try {
    const response = await apiClient.diet.detectFood(formData)
    annotatedImage.value = response.data.annotated_image_url
    $q.notify({ type: 'positive', message: 'Food detection completed!' })
  } catch (error) {
    console.error('Error detecting food:', error)
    $q.notify({ type: 'negative', message: 'Failed to detect food.' })
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
img {
  border: 1px solid #ccc;
  border-radius: 8px;
}
</style>
