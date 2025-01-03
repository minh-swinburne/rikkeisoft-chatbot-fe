<template>
  <section class="bg-light py-3 py-md-5">
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
            <form @submit.prevent="submitForm">
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
                  <label v-if="activeTab === 'file'" for="file-upload-input">
                    Choose File
                  </label>
                  <label v-else for="weblink-input">
                    Enter Weblink
                  </label>

                  <input
                    v-if="activeTab === 'file'"
                    id="file-upload-input"
                    type="file"
                    class="form-control"
                    accept=".pdf, .doc, .docx, .xls, .xlsx"
                    required
                  />
                  <input
                    v-else
                    id="weblink-input"
                    type="url"
                    class="form-control"
                    placeholder="https://example.com"
                    required
                  />
                </div>

                <!-- Shared Fields -->
                <div class="col-12 field-container required">
                  <label for="document-name">Document Name</label>
                  <input id="document-name" type="text" class="form-control" required />
                </div>
                <div class="col-12 field-container">
                  <label for="description">Description</label>
                  <textarea id="description" class="form-control" rows="3"></textarea>
                </div>
                <div class="col-12 field-container required">
                  <label for="category">Category</label>
                  <select id="category" class="form-select">
                    <option value="guidance">Guidance</option>
                    <option value="documents">Documents</option>
                  </select>
                </div>
                <div class="col-12 field-container">
                  <label for="created-date">Day Created</label>
                  <input id="created-date" type="date" class="form-control" />
                </div>

                <!-- Submit Button -->
                <div class="col-12">
                  <div class="d-grid">
                    <button class="btn btn-primary btn-lg" type="submit">Upload</button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from "vue";

const activeTab = ref("file"); // Default tab is "File Upload"

function submitForm() {
  alert("Form submitted! (Implementation pending)");
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
</style>
