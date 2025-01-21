<template>
  <q-header elevated class="bg-primary text-white">
    <q-toolbar>
      <nav-bar />
    </q-toolbar>
  </q-header>
  
  <section class="bg-light min-vh-100 py-3 py-md-5 d-flex flex-column justify-content-center">
    <div class="container">
      <!-- Title and Description -->
      <div class="row justify-content-md-center">
        <div class="col-12 col-md-10 col-lg-8 col-xl-7 col-xxl-6">
          <h2 class="mb-4 display-5 text-center">Document Upload</h2>
          <p class="text-secondary mb-4 text-center">
            Use this form to upload a document or provide a web link. Fill in the required fields to ensure proper categorization and access control.
          </p>
          <hr class="w-50 mx-auto mb-4 mb-xl-9 border-dark-subtle">
        </div>
      </div>
    </div>

    <!-- Form Section -->
    <div class="container">
      <div class="row justify-content-lg-center">
        <div class="col-12 col-lg-9">
          <div class="bg-white border rounded shadow-sm overflow-hidden">
            <form
              v-if="authStore.isAdmin"
              ref="upload-form"
              @submit.prevent="submit"
            >
              <!-- Tabs -->
              <ul class="nav nav-tabs mb-4 px-4 pt-4">
                <li class="nav-item">
                  <a
                    class="nav-link"
                    :class="{ active: activeTab === 'file' }"
                    @click.prevent="activeTab = 'file'"
                    href="#"
                  >
                    File Upload
                  </a>
                </li>
                <li class="nav-item">
                  <a
                    class="nav-link"
                    :class="{ active: activeTab === 'weblink' }"
                    @click.prevent="activeTab = 'weblink'"
                    href="#"
                  >
                    Weblink Upload
                  </a>
                </li>
              </ul>

              <div class="row gy-4 gy-xl-5 px-4 pb-4">
                <!-- Conditional Input: File or Weblink -->
                <div class="col-12 field-container required">
                  <label v-if="activeTab === 'file'" for="file-upload-input" class="form-label">
                    Choose File
                  </label>
                  <label v-else for="weblink-input" class="form-label">
                    Enter Weblink
                  </label>

                  <input
                    v-if="activeTab === 'file'"
                    id="file-upload-input"
                    type="file"
                    name="file"
                    class="form-control"
                    accept=".pdf, .doc, .docx, .xls, .xlsx"
                    required
                    @change="handleFileUpload"
                  />
                  <input
                    v-else
                    id="weblink-input"
                    type="url"
                    name="link"
                    class="form-control"
                    placeholder="https://example.com"
                    required
                  />
                </div>

                <!-- Shared Fields -->
                <div class="col-12 field-container required">
                  <label for="document-name" class="form-label">Document Title</label>
                  <input id="document-name" type="text" name="title" class="form-control" required />
                </div>
                <div class="col-12 field-container">
                  <label for="description" class="form-label">Description</label>
                  <textarea id="description" name="description" class="form-control" rows="3"></textarea>
                </div>
                <div class="col-12 field-container required">
                  <label for="categories" class="form-label">Categories</label>
                  <div class="row">
                    <div
                      v-for="(option, index) in categories"
                      :key="index"
                      class="col-6 mb-2"
                    >
                      <label class="form-check-label">
                        <input
                          type="checkbox"
                          class="form-check-input"
                          :value="option"
                          v-model="selectedCategories"
                        />
                        {{ option }}
                      </label>
                    </div>
                  </div>
                </div>
                <div class="col-12 field-container">
                  <label for="created-date" class="form-label">Day Created</label>
                  <input
                    v-model="createdDate"
                    id="created-date"
                    type="date"
                    name="createdDate"
                    class="form-control"
                  />
                </div>
                <div class="col-12 field-container required">
                  <label for="creator" class="form-label">Creator (Email)</label>
                  <input
                    v-model="creator"
                    id="creator"
                    type="text"
                    name="creator"
                    class="form-control"
                    required
                  />
                </div>
                <div class="col-12 field-container required">
                  <label for="restricted" class="form-label col-12">Access</label>
                  <div class="col-12">
                    <div class="row mx-0 gap-3">
                      <label class="btn btn-outline-secondary col">
                        <input v-model="restricted" id="accessAll" type="radio" class="btn-check" name="restricted" value="all" required />
                        Everyone
                      </label>
                      <label class="btn btn-outline-secondary col">
                        <input v-model="restricted" id="accessAdmin" type="radio" class="btn-check" name="restricted" value="admin" />
                        Admin Only
                      </label>
                    </div>
                  </div>
                </div>

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
        </q-col>
      </q-row>
    </q-container>
  </q-page>
</template>

<script setup>
import axios from "axios";
import NavBar from "@/components/NavBar.vue";
import { ref, useTemplateRef } from "vue";
import { useAuthStore } from "@/stores/auth";
import { useRouter, RouterLink } from "vue-router";

const $router = useRouter();
const authStore = useAuthStore();
const formRef = useTemplateRef("upload-form");

const activeTab = ref("file"); // Default tab is "File Upload"
const file = ref(null);
const createdDate = ref(""); // Default date is today
const creator = ref(authStore.user?.email);
const restricted = ref("all"); // Default access is "Everyone"

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
  const input = event.target; // Ensure we are targeting the input element
  if (input && input.files && input.files.length > 0) {
    const uploadedFile = input.files[0]; // Get the first uploaded file
    file.value = uploadedFile;

    const date = new Date(uploadedFile.lastModified);
    createdDate.value = date.toISOString().slice(0, 10); // Set the created date
  } else {
    alert("No file selected or input is invalid!");
  }
}

function submit() {
  try {
    const formData = new FormData(formRef.value);
    formData.append("uploader", authStore.user.email);
    formData.append("categories", selectedCategories.value.join(","));
    formData.set("restricted", restricted.value === "all" ? false : true);

    console.log("Submitting form with data:", Array.from(formData.entries()));

    axios
      .post("http://127.0.0.1:8000/api/v1/docs", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((response) => {
        console.log(response.data);
        alert("Document uploaded successfully!");
      })
      .catch((error) => {
        console.error("Upload error:", error);
        alert("An error occurred while uploading the document.");
      });
  } catch (err) {
    console.error("Form submission error:", err);
    alert("Error in form submission.");
  }
}
</script>

<style scoped>
/* Align text to the left for field-container */
.form-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 64px); /* Adjust for header height */
}

q-row {
width: 60%;
}


.q-col {
  max-width: 70%; /* Set your max width */
  margin: 0 auto;
}

/* Custom styles for form fields */
.q-input,
.q-select,
.q-radio {
  width: 100%;
}

.q-banner {
  background-color: var(--q-banner-bg-color, #f7f7f7);
  padding: 16px;
  border-radius: 8px;
}
</style>
