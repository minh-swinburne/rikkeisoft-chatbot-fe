<template>
  <nav-bar></nav-bar>

  <div class="document-list">
    <ul>
      <li v-for="document in documents" :key="document.id" class="document-item">
        <h2 class="document-title">
          <p target="_blank">{{ document.title }}</p>
        </h2>
        <p class="document-description">{{ document.description }}</p>
        <div class="document-meta">
          <span class="meta-item"><strong>Categories:</strong> {{ Array.isArray(document.categories) ? document.categories.join(', ') : (document.categories || 'N/A') }}</span>
          <span class="meta-item"><strong>Created:</strong> {{ formatDate(document.created_date) }}</span>
          <span class="meta-item"><strong>Creator (Will Make It Show User Instead User ID Later):</strong> {{ document.creator }}</span>
          <span class="meta-item"><strong>Access:</strong> {{ document.restricted ? 'Admin Only' : 'Everyone' }}</span>
        </div>
        <div class="document-actions">
          <button @click="previewDocument(document)" class="action-button preview">Preview</button>
          <button @click="editDocument(document)" class="action-button edit">Edit</button>
          <button @click="downloadDocument(document)" class="action-button download">Download</button>
          <button @click="deleteDocument(document)" class="action-button delete">Delete</button>
        </div>
      </li>
    </ul>
  </div>

  <div v-if="showViewer" class="document-viewer-modal">
    <div class="document-viewer-content">
      <button @click="closeViewer" class="close-button">&times;</button>
      <h2>{{ currentDocument.title }}</h2>
      <iframe :src="`http://127.0.0.1:8000/api/v1/docs/${currentDocument.id}/preview`" width="100%" height="600px"></iframe>
    </div>
  </div>

  <!-- Improved Edit Document Form Overlay -->
  <div v-if="showEditForm" class="edit-form-overlay">
    <div class="edit-form-content">
      <button @click="closeEditForm" class="close-button">&times;</button>
      <h2>Edit Document</h2>
      <form @submit.prevent="submitEditForm" class="edit-form">
        <div class="form-group">
          <label for="title">Title:</label>
          <input type="text" id="title" v-model="editFormData.title" required />
        </div>
        <div class="form-group">
          <label for="description">Description:</label>
          <textarea id="description" v-model="editFormData.description" rows="4"></textarea>
        </div>
        <div class="form-group">
          <label for="categories">Categories:</label>
          <vue-multiselect
            v-model="editFormData.categories"
            :options="availableCategories"
            :multiple="true"
            :taggable="true"
            @tag="addCategory"
            placeholder="Select or add categories"
          ></vue-multiselect>
        </div>
        <div class="form-group">
          <label for="restricted">Access:</label>
          <div class="radio-group">
            <label>
              <input type="radio" v-model="editFormData.restricted" :value="false" />
              Everyone
            </label>
            <label>
              <input type="radio" v-model="editFormData.restricted" :value="true" />
              Admin Only
            </label>
          </div>
        </div>
        <button type="submit" class="submit-button">Save Changes</button>
      </form>
    </div>
  </div>
</template>


<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import NavBar from "@/components/NavBar.vue";
import VueMultiselect from 'vue-multiselect';

const documents = ref([]);
const showViewer = ref(false);
const currentDocument = ref(null);
const showEditForm = ref(false);
const editFormData = ref({
  id: '',
  title: '',
  description: '',
  categories: [],
  restricted: false,
});
const availableCategories = ref([]);

const fetchDocuments = async () => {
  try {
    const response = await axios.get('http://127.0.0.1:8000/api/v1/docs');
    documents.value = response.data;
    updateAvailableCategories();
  } catch (error) {
    console.error('Error fetching documents:', error);
  }
};

const updateAvailableCategories = () => {
  const categories = new Set();
  documents.value.forEach(doc => {
    if (Array.isArray(doc.categories)) {
      doc.categories.forEach(cat => categories.add(cat));
    } else if (doc.categories) {
      categories.add(doc.categories); // Handle non-array categories
    }
  });
  availableCategories.value = Array.from(categories);
};


onMounted(fetchDocuments);

const formatDate = (dateString) => {
  if (!dateString) return 'Invalid Date';
  const date = new Date(dateString);
  return date.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
};

const previewDocument = (document) => {
  currentDocument.value = document;
  showViewer.value = true;
};

const closeViewer = () => {
  showViewer.value = false;
  currentDocument.value = null;
};

const editDocument = (document) => {
  editFormData.value = {
    id: document.id,
    title: document.title || '',
    description: document.description || '',
    categories: Array.isArray(document.categories) ? document.categories : (document.categories ? [document.categories] : []),
    restricted: document.restricted || false,
  };
  showEditForm.value = true;
};

const closeEditForm = () => {
  showEditForm.value = false;
};

const submitEditForm = async () => {
  try {
    const formData = new FormData();
    formData.append('doc_id', editFormData.value.id);
    formData.append('title', editFormData.value.title);
    formData.append('description', editFormData.value.description);
    formData.append('categories', editFormData.value.categories);
    formData.append('restricted', editFormData.value.restricted);

    const response = await axios.put(
      `http://127.0.0.1:8000/api/v1/docs/${editFormData.value.id}/edit`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    
    const updatedDoc = response.data;
    const index = documents.value.findIndex(doc => doc.id === updatedDoc.id);
    if (index !== -1) {
      documents.value[index] = updatedDoc;
    }
    closeEditForm();
  } catch (error) {
    console.error('Error updating document:', error);
  }
};


const downloadDocument = async (doc) => {
  try {
    const response = await axios.get(`http://127.0.0.1:8000/api/v1/docs/${doc.id}/download`, {
      responseType: 'blob',
    });
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', doc.filename);
    document.body.appendChild(link);
    link.click();
    link.remove();
  } catch (error) {
    console.error('Error downloading document:', error);
  }
};

const deleteDocument = async (document) => {
  if (confirm(`Are you sure you want to delete "${document.title}"?`)) {
    try {
      await axios.delete(`http://127.0.0.1:8000/api/v1/docs/${document.id}/delete`);
      documents.value = documents.value.filter(doc => doc.id !== document.id);
    } catch (error) {
      console.error('Error deleting document:', error);
    }
  }
};

const addCategory = (newCategory) => {
  availableCategories.value.push(newCategory);
};
</script>

<style src="vue-multiselect/dist/vue-multiselect.css"></style>

<style scoped>
/* NavBar styles */
nav-bar {
  background-color: #2c3e50;
  padding: 15px 20px;
  color: white;
  text-align: center;
  margin-bottom: 30px;
}

/* Document List styles */
.document-list {
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
  background-color: #f8f9fa;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

h1 {
  text-align: center;
  font-size: 28px;
  margin-bottom: 30px;
  color: #2c3e50;
}

ul {
  list-style: none;
  padding-left: 0;
}

.document-item {
  background-color: #fff;
  margin: 20px 0;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease-in-out;
  border: 1px solid #0026ff;
}

.document-item:hover {
  transform: translateY(-5px);
}

.document-title {
  margin: 0 0 10px 0;
  font-size: 22px;
}

.document-title a {
  text-decoration: none;
  color: #0026ff;
}

.document-title a:hover {
  text-decoration: underline;
}

.document-description {
  color: #555;
  margin-bottom: 15px;
  line-height: 1.5;
}

.document-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  font-size: 14px;
  color: #666;
  margin-bottom: 15px;
  justify-content: center;
}

.meta-item {
  background-color: #e9ecef;
  padding: 5px 10px;
  border-radius: 15px;
}

.meta-item strong {
  color: #2c3e50;
}

.document-actions {
  display: flex;
  gap: 10px;
  justify-content: center;
}

.action-button {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  transition: background-color 0.2s ease-in-out;
}

.preview {
  background-color: #3498db;
  color: white;
}

.preview:hover {
  background-color: #2980b9;
}

.edit {
  background-color: #f39c12;
  color: white;
}

.edit:hover {
  background-color: #d35400;
}

.download {
  background-color: #2ecc71;
  color: white;
}

.download:hover {
  background-color: #27ae60;
}

.delete {
  background-color: #e74c3c;
  color: white;
}

.delete:hover {
  background-color: #c0392b;
}

/* Document Viewer Modal styles */
.document-viewer-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.document-viewer-content {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  width: 80%;
  max-width: 1000px;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
}

.close-button {
  position: absolute;
  top: 10px;
  right: 10px;
  font-size: 24px;
  background: none;
  border: none;
  cursor: pointer;
}

.edit-form-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.edit-form-content {
  background-color: white;
  padding: 30px;
  border-radius: 8px;
  width: 500px;
  max-width: 90%;
  position: relative;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.edit-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.form-group label {
  font-weight: bold;
  color: #333;
}

.form-group input[type="text"],
.form-group textarea {
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 14px;
}

.form-group textarea {
  resize: vertical;
  min-height: 100px;
}

.radio-group {
  display: flex;
  gap: 20px;
}

.radio-group label {
  display: flex;
  align-items: center;
  gap: 5px;
  cursor: pointer;
}

.submit-button {
  background-color: #3498db;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  font-weight: bold;
  transition: background-color 0.2s ease-in-out;
}

.submit-button:hover {
  background-color: #2980b9;
}

/* Vue Multiselect custom styles */
::v-deep .multiselect {
  min-height: 40px;
}

::v-deep .multiselect__tags {
  min-height: 40px;
  padding: 8px 40px 0 8px;
  border-radius: 4px;
  border: 1px solid #ccc;
}

::v-deep .multiselect__input {
  margin-bottom: 8px;
}

::v-deep .multiselect__single {
  margin-bottom: 8px;
}

::v-deep .multiselect__content-wrapper {
  border-radius: 0 0 4px 4px;
}
</style>

