<template>
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
              v-if="authStore.user?.admin"
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
                  <label for="document-name" class="form-label">Document Name</label>
                  <input id="document-name" type="text" name="title" class="form-control" required />
                </div>
                <div class="col-12 field-container">
                  <label for="description" class="form-label">Description</label>
                  <textarea id="description" name="description" class="form-control" rows="3"></textarea>
                </div>
                <div class="col-12 field-container required">
                  <label for="category" class="form-label">Category</label>
                  <select id="category" name="categories" class="form-select">
                    <option value="guidance">Guidance</option>
                    <option value="documents">Documents</option>
                  </select>
                </div>
                <div class="col-12 field-container">
                  <label for="created-date" class="form-label">Day Created</label>
                  <input
                    v-model="createdDate"
                    id="created-date"
                    type="date"
                    name="created-date"
                    class="form-control"
                  />
                </div>
                <div class="col-12 field-container required">
                  <label for="creator" class="form-label">Creator</label>
                  <input
                    v-model="creator"
                    id="creator"
                    type="text"
                    name="creator"
                    class="form-control"
                    required
                  />
                </div>
                <div class="col-12 field-container">
                  <div class="col-12">
                    <label for="restricted" class="form-label">Access</label>
                  </div>
                  <div class="col-12">
                    <div class="row mx-0 gap-3">
                      <label class="btn btn-outline-secondary col">
                        <input v-model="restricted" id="accessAll" type="radio" class="btn-check" name="restricted" value="all" />
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
                <div class="col-12">
                  <div class="d-grid">
                    <button class="btn btn-danger btn-lg" type="submit">Upload</button>
                  </div>
                </div>
              </div>
            </form>

            <!-- Access Denied Message -->
            <div v-else class="text-center py-5">
              <h3 class="text-danger">Access Denied</h3>
              <p class="text-secondary">You need to be logged in as an admin to upload documents.</p>
              <router-link
                :to="{ path: '/login', query: { redirect: $route.fullPath } }"
                @click="authStore.logout"
                class="btn btn-danger"
              >
                Login
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import axios from "axios";
import { ref, useTemplateRef } from "vue";
import { useAuthStore } from "@/stores/auth";
import { RouterLink } from "vue-router";

const authStore = useAuthStore();
const formRef = useTemplateRef("upload-form");

const activeTab = ref("file"); // Default tab is "File Upload"
const file = ref(null);
const createdDate = ref(""); // Default date is today
const creator = ref(authStore.user?.username);
const restricted = ref("all"); // Default access is "Everyone"

function handleFileUpload(event) {
  const uploadedFile = event.target.files[0];

  file.value = uploadedFile;

  if (uploadedFile) {
    const date = new Date(uploadedFile.lastModified);
    // console.log(uploadedFile);

    createdDate.value = date.toISOString().slice(0, 10); // Format as DD/MM/YYYY
  }
}

function submit() {
  const formData = new FormData(formRef.value);

  formData.append("uploader", authStore.user.username);
  formData.set("restricted", restricted.value === "all" ? false : true);

  // Log the form data for debugging
  for (let [key, value] of formData.entries()) {
    console.log(`${key}: ${value}`);
  }

  // Submit the form data to the server
  axios
    .post("http://127.0.0.1:8000/api/v1/docs", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    .then((response) => {
      console.log(response.data);
      alert("Document uploaded successfully!");
    })
    .catch((error) => {
      console.error(error);
      alert("An error occurred while uploading the document.");
    });
}
</script>

<style scoped>
/* Align text to the left for field-container */
.field-container {
  text-align: left;
}

/* Active tab styling */
.nav-tabs .nav-link.active {
  background-color: #007bff;
  color: white;
}

.field-container.required label:after {
  content: " *";
  color: red;
}

label.btn:has(input[type="radio"]:checked) {
  background-color: var(--bs-btn-active-bg);
  color: var(--bs-btn-active-color);
}
</style>
