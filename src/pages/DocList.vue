<template>
  <q-layout view="hHh LpR fFf" :class="{ 'bg-dark': $q.dark.isActive }">
    <q-header bordered :class="$q.dark.isActive ? 'bg-dark' : 'bg-secondary'">
      <q-toolbar>
        <nav-bar />
      </q-toolbar>
    </q-header>

    <q-page-container>
      <q-page padding>
        <div class="document-list q-pa-md">
          <div class="row q-col-gutter-md q-mb-md items-center">
            <div class="col-grow">
              <q-input v-model="searchQuery" label="Search" dense>
                <template v-slot:append>
                  <q-icon name="search" />
                </template>
              </q-input>
            </div>
            <div class="col-auto">
              <q-btn-dropdown color="secondary" label="Filter" icon="filter_list">
                <q-card>
                  <q-card-section>
                    <div class="text-h6">Filter by Categories</div>
                    <q-select
                      v-model="selectedCategories"
                      :options="availableCategories"
                      multiple
                      dense
                      use-chips
                      class="q-mt-sm"
                    />
                  </q-card-section>
                  <q-card-actions align="right">
                    <q-btn flat label="Clear" color="secondary" @click="clearFilters" />
                    <q-btn flat label="Apply" color="secondary" v-close-popup />
                  </q-card-actions>
                </q-card>
              </q-btn-dropdown>
            </div>
          </div>

          <q-list bordered separator class="max-width-70">
            <q-item v-for="document in paginatedDocuments" :key="document.id" class="q-my-sm">
              <q-item-section>
                <q-item-label class="text-h6">{{ document.title }}</q-item-label>
                <q-item-label caption>{{ document.description }}</q-item-label>
                <q-item-label caption>
                  <strong>Categories:</strong>
                  <q-chip
                    v-for="category, index in document.categories"
                    :key="index"
                    color="grey-9"
                    dense
                  >
                    {{ category }}
                  </q-chip>
                </q-item-label>
                <q-item-label caption>
                  <strong>Created:</strong> {{ formatDate(document.created_date) }}
                </q-item-label>
                <q-item-label caption>
                  <strong>Creator:</strong> {{ document.creator }}
                </q-item-label>
                <q-item-label caption>
                  <strong>Access:</strong> {{ document.restricted ? 'Admin Only' : 'Everyone' }}
                </q-item-label>
              </q-item-section>
              <q-item-section side>
                <div class="row q-gutter-sm">
                  <q-btn color="secondary" icon="visibility" @click="previewDocument(document)" label="Preview" />
                  <q-btn color="warning" icon="edit" @click="editDocument(document)" label="Edit" />
                  <q-btn color="positive" icon="download" @click="downloadDocument(document)" label="Download" />
                  <q-btn color="negative" icon="delete" @click="deleteDocument(document)" label="Delete" />
                </div>
              </q-item-section>
            </q-item>
          </q-list>

          <div class="row justify-center q-mt-md ">
            <q-pagination
              v-model="currentPage"
              :max="totalPages"
              :max-pages="5"
              boundary-links
            />
          </div>
        </div>
      </q-page>
    </q-page-container>

    <q-dialog v-model="showViewer" full-width>
      <q-card>
        <q-card-section>
          <div class="text-h6 text-center">{{ currentDocument?.title }}</div>
        </q-card-section>
        <q-card-section class="q-pa-none" align="center">
          <iframe :src="`http://127.0.0.1:8000/api/v1/docs/${currentDocument?.id}/preview`" style="width: 70%; height: 600px;"  />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Close" color="secondary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="showEditForm">
      <q-card style="width: 500px; max-width: 90vw;">
        <q-card-section>
          <div class="text-h6">Edit Document</div>
        </q-card-section>
        <q-card-section>
          <q-form @submit="submitEditForm">
            <q-input v-model="editFormData.title" label="Title" required />
            <q-input v-model="editFormData.description" type="textarea" label="Description" />
            <q-select
              v-model="editFormData.categories"
              :options="availableCategories"
              label="Categories"
              multiple
            >
            <template v-slot:selected-item="scope">
              <q-chip
                v-if="editFormData.categories"
                removable
                dense
                color="grey-9"
                @remove="scope.removeAtIndex(scope.index)"
                :tabindex="scope.tabindex"
              >
                {{ scope.opt }}
              </q-chip>
            </template>
            </q-select>

            <q-option-group
              v-model="editFormData.restricted"
              :options="[
                { label: 'Everyone', value: false },
                { label: 'Admin Only', value: true }
              ]"
              color="secondary"
            />
            <q-card-actions align="right">
              <q-btn flat label="Cancel" color="secondary" v-close-popup />
              <q-btn flat label="Save Changes" type="submit" color="secondary" />
            </q-card-actions>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-layout>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useQuasar } from 'quasar';
import NavBar from "@/components/NavBar.vue";
import APIClient from "@/api.js";

const $q = useQuasar();
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

const isDark = ref(false)

const availableCategories = ref([
  'Guidance',
  'Policies',
  'Reports',
  'Procedures',
  'Training Materials',
  'Technical Documentation',
]);

const searchQuery = ref('');
const selectedCategories = ref([]);
const currentPage = ref(1);
const itemsPerPage = 10;

const fetchDocuments = async () => {
  try {
    const response = await APIClient.getDocs();
    documents.value = response.data;
    documents.value.forEach(document => {
      document.categories = JSON.parse(document.categories);
    });
  } catch (error) {
    console.error('Error fetching documents:', error);
    $q.notify({
      color: 'negative',
      message: 'Failed to fetch documents',
      icon: 'report_problem'
    });
  }
};

onMounted(() => {
  fetchDocuments();
  const savedDarkMode = localStorage.getItem('darkMode')
  if (savedDarkMode !== null) {
    isDark.value = savedDarkMode === 'true'
    $q.dark.set(isDark.value)
  }
});

const formatDate = (dateString) => {
  if (!dateString) return 'Invalid Date';
  const date = new Date(dateString);
  return date.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
};

const filteredDocuments = computed(() => {
  return documents.value.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
                          doc.description.toLowerCase().includes(searchQuery.value.toLowerCase());
    const matchesCategories = selectedCategories.value.length === 0 ||
                              doc.categories.some(cat => selectedCategories.value.includes(cat));
    return matchesSearch && matchesCategories;
  });
});

const paginatedDocuments = computed(() => {
  const startIndex = (currentPage.value - 1) * itemsPerPage;
  return filteredDocuments.value.slice(startIndex, startIndex + itemsPerPage);
});

const totalPages = computed(() => {
  return Math.ceil(filteredDocuments.value.length / itemsPerPage);
});

const clearFilters = () => {
  selectedCategories.value = [];
};

const previewDocument = (document) => {
  currentDocument.value = document;
  showViewer.value = true;
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

const submitEditForm = async () => {
  try {
    const formData = new FormData();
    formData.append('doc_id', editFormData.value.id);
    formData.append('title', editFormData.value.title);
    formData.append('description', editFormData.value.description);
    formData.append('categories', JSON.stringify(editFormData.value.categories));
    formData.append('restricted', editFormData.value.restricted);

    await APIClient.editDocs(editFormData.value.id,formData);
    
    fetchDocuments()
    $q.notify({
      color: 'positive',
      message: 'Document updated successfully',
      icon: 'check'
    });
  } catch (error) {
    console.error('Error updating document:', error);
    $q.notify({
      color: 'negative',
      message: 'Failed to update document',
      icon: 'report_problem'
    });
  }
};

const downloadDocument = async (doc) => {
  try {
    const response = await APIClient.downloadDoc(doc.id)
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', doc.filename);
    document.body.appendChild(link);
    link.click();
    link.remove();
    $q.notify({
      color: 'positive',
      message: 'Document downloaded successfully',
      icon: 'check'
    });
  } catch (error) {
    console.error('Error downloading document:', error);
    $q.notify({
      color: 'negative',
      message: 'Failed to download document',
      icon: 'report_problem'
    });
  }
};

const deleteDocument = async (document) => {
  try {
    await $q.dialog({
      title: 'Confirm Deletion',
      message: `Are you sure you want to delete "${document.title}"?`,
      cancel: true,
      persistent: true
    });

    await APIClient.deleteDoc(document.id);
    documents.value = documents.value.filter(doc => doc.id !== document.id);
    $q.notify({
      color: 'positive',
      message: 'Document deleted successfully',
      icon: 'check'
    });
  } catch (error) {
    if (error) {
      console.error('Error deleting document:', error);
      $q.notify({
        color: 'negative',
        message: 'Failed to delete document',
        icon: 'report_problem'
      });
    }
  }
};
</script>

<style>
  .max-width-70 {
    max-width: 70%;
    margin: 0 auto; /* Optional: centers the list */
  }
</style>

