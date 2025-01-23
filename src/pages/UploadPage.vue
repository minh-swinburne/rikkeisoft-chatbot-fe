<template>
  <q-layout view="hHh LpR fFf" :class="{ 'bg-dark': $q.dark.isActive }">
    <q-header bordered :class="$q.dark.isActive ? 'bg-dark' : 'bg-primary'">
      <q-toolbar>
        <nav-bar />
      </q-toolbar>
    </q-header>

    <q-page-container>
      <q-page padding class="max-width-70 q-pa-md">
              <q-card flat bordered class="q-pa-md">
                <!-- Form Section -->
                <q-form v-if="authStore.isAdmin"
                        ref="uploadForm"
                        @submit.prevent="submit">
                  <!-- Tabs for File or Weblink Upload -->
                  <q-tabs v-model="activeTab" class="q-mb-md" dense>
                    <q-tab name="file" label="File Upload" />
                    <q-tab name="link" label="Web Link Upload" />
                  </q-tabs>
  
                  <q-separator />
  
                  <!-- File / Weblink Input Section -->
                  <q-file
                    v-if="activeTab === 'file'"
                    v-model="file"
                    name="file"
                    label="Choose File"
                    accept=".pdf, .doc, .docx, .xls, .xlsx"
                    class="q-mb-md"
                    filled
                    outlined
                    required
                    @input="handleFileUpload"
                    :rules="[val => !!val || 'Field is required']"
                  >
                    <template v-slot:append>
                      <q-icon name="attach_file" />
                    </template>
  
                  </q-file>
  
                  <q-input
                    v-else
                    v-model="link"
                    name="link"
                    label="Enter Weblink"
                    placeholder="https://example.com"
                    class="q-mb-md"
                    filled
                    required
                    :rules="[val => !!val || 'Field is required']"
                  />
  
                  <!-- Shared Fields Section -->
                  <q-input
                    v-model="documentTitle"
                    name="title"
                    label="Document Title"
                    class="q-mb-md"
                    filled
                    required
                    :rules="[val => !!val || 'Field is required']"
                  />
  
                  <q-input
                    v-model="description"
                    name="description"
                    label="Description"
                    type="textarea"
                    class="q-mb-md"
                    filled
                    required
                  />
  
                  <q-select
                    v-model="selectedCategories"
                    :options="categories"
                    name="categories"
                    label="Categories"
                    class="q-mb-md"
                    type="checkbox"
                    multiple
                    filled
                    required
                    :rules="[val => !!val || 'Field is required']"
                  />
  
                  <q-input v-model="createdDate" name="createdDate" label="Day Created" type="date" class="q-mb-md" filled />
  
                  <q-input v-model="creator" name="creator" label="Creator (Email)" class="q-mb-md" filled required :rules="[val => !!val || 'Field is required']"/>
  
                  <!-- Access Control Section -->
                  <q-radio
                    v-model="restricted"
                    name="restricted"
                    label="Everyone"
                    val="all"
                    class="q-mb-md"
                    inline
                  />
                  <q-radio
                    v-model="restricted"
                    name="restricted"
                    label="Admin Only"
                    val="admin"
                    class="q-mb-md"
                    inline
                  />
  
                  <!-- Submit Button -->
                  <q-btn label="Upload" color="primary" type="submit" class="full-width" />
                </q-form>
  
                <!-- Access Denied Message -->
                <q-banner v-else class="q-pa-md">
                  <q-item-label class="text-center text-danger" style="font-weight: 600">
                    Access Denied
                  </q-item-label>
                  <q-item-label class="text-center text-grey-7">
                    You need to be logged in as an admin to upload documents.
                  </q-item-label>
  
                  <!-- Login Button using RouterLink -->
                  <RouterLink :to="{ path: '/login', query: { redirect: $route.fullPath } }">
                    <q-btn label="Login" color="secondary" class="full-width" />
                  </RouterLink>
  
                  <!-- Logout Button (if the user is already logged in) -->
                  <q-btn
                    v-if="authStore.user"
                    label="Logout"
                    color="negative"
                    @click="logout"
                    class="full-width q-mt-md"
                  />
                </q-banner>
              </q-card>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import NavBar from "@/components/NavBar.vue";
import { ref, onMounted } from "vue";
import { useAuthStore } from "@/plugins/stores/auth";
import { useRouter, RouterLink } from "vue-router";
import { useQuasar } from "quasar";
import APIClient from '@/api.js'


const $q = useQuasar();
const $router = useRouter();
const authStore = useAuthStore();
// const formRef = useTemplateRef("uploadForm"); // Reference to the form element

const isDark = ref(false)

const uploadForm = ref(null); // Reference to the form element
const activeTab = ref("file"); // Default tab is "File Upload"
const file = ref(null);
const link = ref(""); // For "Weblink Upload"
const createdDate = ref(""); // Default date is today
const creator = ref(authStore.user?.email);
const restricted = ref("admin"); // Default access is "Everyone"
const documentTitle = ref(""); // For "Document Title"
const description = ref("");   // For "Description"

const categories = ref([
  "Guidance",
  "Policies",
  "Reports",
  "Procedures",
  "Training Materials",
  "Technical Documentation",
]);
const selectedCategories = ref([]); // To store the selected categories

function logout() {
  authStore.logout();
  $router.push("/login");
}

function handleFileUpload(event) {
  const uploadedFile = event.target.files[0];


  if (uploadedFile) {
    const date = new Date(uploadedFile.lastModified);
    // console.log(uploadedFile);

    createdDate.value = date.toISOString().slice(0, 10); // Format as DD/MM/YYYY
  }
}

function submit() {
  uploadForm.value.validate().then((success) => {
    if (success) {
      console.log("Form submitted successfully!");

      // Construct FormData
      const formData = new FormData();

      // Append form data fields
      if (file.value && activeTab.value === "file") {
        formData.append("file", file.value);
      } else if (activeTab.value === "link" && link.value) {
          formData.append("link", link.value);
      }

      formData.append("title", documentTitle.value);
      formData.append("description", description.value || ""); // Optional
      formData.append("categories", selectedCategories.value.join(","));
      formData.append("createdDate", createdDate.value || new Date().toISOString().slice(0, 10)); // Use today as default
      formData.append("creator", creator.value);
      formData.append("restricted", restricted.value === "all" ? "false" : "true");
      formData.append("uploader", authStore.user.email);

      // Debug FormData entries
      for (let [key, value] of formData.entries()) {
        console.log(`${key}:`, value);
      }
      // Submit form data via Axios
      APIClient.uploadDocs(formData)
        .then((response) => {
          console.log("Upload success:", response.data);
          $q.notify({
            type: "positive",
            message: "Document uploaded successfully!",
          });
        })
        .catch((error) => {
          console.error("Upload failed:", error.response || error);
          if (error.response) {
            console.error("Error details:", error.response.data);  // Log error details from server response
          }
          $q.notify({
            type: "negative",
            message: "An error occurred while uploading the document.",
          });
        });
    } else {
      $q.notify({
        type: "negative",
        message: "Please fill in all required fields.",
      });
    }
  });

  console.log($q.notify);
}

onMounted(() => {
  const savedDarkMode = localStorage.getItem('darkMode')
  if (savedDarkMode !== null) {
    isDark.value = savedDarkMode === 'true'
    $q.dark.set(isDark.value)
  }
});
</script>

<style scoped>
.max-width-70 {
  max-width: 70%;
  margin: 0 auto; /* Optional: centers the list */
}
</style>
