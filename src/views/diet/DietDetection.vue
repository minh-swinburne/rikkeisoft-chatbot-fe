<template>
  <q-page padding class="row col-grow justify-center q-pa-md">
    <q-card flat bordered class="col-12 col-md-8 q-pa-lg">
      <q-form @submit.prevent="submitImage">
        <!-- <h5 class="text-center q-mb-lg">Food Object Detection</h5> -->

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
          <div style="position: relative; display: inline-block">
            <img
              id="preview-image"
              :src="previewSrc"
              alt="Preview"
              style="max-width: 100%; height: 350px; margin: auto"
            />
            <canvas
              v-if="predictions?.length"
              ref="canvas"
              style="position: absolute; top: 0; left: 0"
            ></canvas>
          </div>
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
    </q-card>
  </q-page>
</template>

<script setup>
import { ref, nextTick } from 'vue'
import { useQuasar } from 'quasar'
import { InferenceEngine, CVImage } from 'inferencejs'

const $q = useQuasar()

const activeTab = ref('upload')
const imageFile = ref(null)
const imageUrl = ref('')
const previewSrc = ref('')
const predictions = ref([])
const loading = ref(false)
const canvas = ref(null)

const inferEngine = new InferenceEngine()
const modelName = 'food-detection-yldun'
const modelVersion = 1
const publishableKey = 'rf_Ry60CHi8gyWmLODoI7LvBcqhwiA3'
let workerId = null

async function initializeModel() {
  try {
    workerId = await inferEngine.startWorker(modelName, modelVersion, publishableKey)
    if (!workerId) {
      throw new Error('Worker initialization failed.')
    }
  } catch (error) {
    console.error('Error initializing model:', error)
    $q.notify({ type: 'negative', message: 'Failed to initialize model. Please try again later.' })
  }
}

function previewImage() {
  if (activeTab.value === 'upload' && imageFile.value) {
    const reader = new FileReader()
    reader.onload = (e) => (previewSrc.value = e.target.result)
    reader.readAsDataURL(imageFile.value)
  } else if (activeTab.value === 'url') {
    previewSrc.value = imageUrl.value
  }

  // Clear the canvas when a new image is loaded
  if (canvas.value) {
    const ctx = canvas.value.getContext('2d')
    ctx.clearRect(0, 0, canvas.value.width, canvas.value.height)
  }
}

async function submitImage() {
  if (!previewSrc.value) {
    $q.notify({ type: 'negative', message: 'Please provide an image.' })
    return
  }

  if (!workerId) {
    $q.notify({
      type: 'negative',
      message: 'Model is not initialized. Please refresh the page or try again later.',
    })
    return
  }

  loading.value = true
  predictions.value = []

  try {
    // Ensure the image is origin-clean
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.src = previewSrc.value

    img.onload = async () => {
      const cvimg = new CVImage(img)
      const result = await inferEngine.infer(workerId, cvimg)
      predictions.value = result
      console.log('Predictions:', result)
      drawAnnotations()
      $q.notify({ type: 'positive', message: 'Food detection completed!' })
    }

    img.onerror = () => {
      $q.notify({
        type: 'negative',
        message: 'Failed to load the image. Please check the URL or try another image.',
      })
    }
  } catch (error) {
    console.error('Error detecting food:', error)
    $q.notify({ type: 'negative', message: 'Failed to detect food.' })
  } finally {
    loading.value = false
  }
}

async function drawAnnotations() {
  await nextTick()
  const imageElement = document.getElementById('preview-image')
  const canvasElement = canvas.value
  const ctx = canvasElement.getContext('2d')

  // Set canvas size to match the original image size
  const originalWidth = imageElement.naturalWidth
  const originalHeight = imageElement.naturalHeight
  const displayWidth = imageElement.width
  const displayHeight = imageElement.height

  canvasElement.width = displayWidth
  canvasElement.height = displayHeight

  ctx.clearRect(0, 0, canvasElement.width, canvasElement.height)
  ctx.strokeStyle = 'red'
  ctx.lineWidth = 2
  ctx.font = '14px Poppins'
  ctx.textBaseline = 'top'

  const scaleX = displayWidth / originalWidth
  const scaleY = displayHeight / originalHeight

  predictions.value.forEach((prediction) => {
    const box = prediction.bounding_box || prediction.bbox
    if (box.x && box.y && box.width && box.height) {
      const { x, y, width, height } = box
      const { class: label, color, confidence } = prediction
      const left = (x - width / 2) * scaleX
      const top = (y - height / 2) * scaleY
      const scaledWidth = width * scaleX
      const scaledHeight = height * scaleY

      // Draw bounding box
      ctx.strokeStyle = color || 'red'
      ctx.strokeRect(left, top, scaledWidth, scaledHeight)

      // Draw label background
      const text = `${label} (${(confidence * 100).toFixed(1)}%)`
      const textWidth = ctx.measureText(text).width
      const textHeight = 16 // Approximate text height based on font size
      ctx.fillStyle = color || 'red'
      ctx.fillRect(left - 1, top - textHeight - 2, textWidth + 4, textHeight + 2)

      // Draw label text
      ctx.fillStyle = 'black'
      ctx.strokeStyle = 'white'
      ctx.lineWidth = 1
      ctx.strokeText(text, left + 2, top - textHeight)
      ctx.fillText(text, left + 2, top - textHeight)
    } else {
      console.error('Invalid prediction format:', prediction)
    }
  })
}

initializeModel()
</script>

<style scoped>
img {
  border: 1px solid #ccc;
  border-radius: 8px;
}
canvas {
  pointer-events: none;
}
</style>
