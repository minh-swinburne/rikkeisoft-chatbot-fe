<template>
  <!-- Navigation Bar -->
  <NavBar />

  <!-- Main Content -->
  <q-page class="bg-light q-pa-md min-h-screen">
    <q-container class="form-container">
      <q-row justify="center" align="center">
        <q-col :cols="12" :md="8" :lg="6" :xl="5" :xxl="4">
          <q-card flat bordered class="q-pa-md">
            <!-- Form Section -->
            <q-form v-if="authStore.isAdmin" @submit.prevent="submit">
              <!-- Tabs for File or Weblink Upload -->
              <q-tabs v-model="activeTab" class="q-mb-md" dense>
                <q-tab name="file" label="File Upload" />
                <q-tab name="weblink" label="Weblink Upload" />
              </q-tabs>

              <q-separator />

              <!-- File / Weblink Input Section -->
              <q-input
  v-if="activeTab === 'file'"
  type="file"
  accept=".pdf, .doc, .docx, .xls, .xlsx"
  @change="handleFileUpload"
  class="q-mb-md"
  filled
  required
/>
              <q-input
                v-if="activeTab === 'weblink'"
                label="Enter Weblink"
                type="url"
                placeholder="https://example.com"
                class="q-mb-md"
                filled
                required
              />

              <!-- Shared Fields Section -->
              <q-input v-model="documentName" label="Document Title" class="q-mb-md" filled required />
              <q-input v-model="description" label="Description" type="textarea" class="q-mb-md" filled />
              <q-select
                v-model="selectedCategories"
                :options="categories"
                label="Categories"
                multiple
                class="q-mb-md"
                filled
                required
              />
              <q-input v-model="createdDate" label="Day Created" type="date" class="q-mb-md" filled />
              <q-input v-model="creator" label="Creator (Email)" class="q-mb-md" filled required />

              <!-- Access Control Section -->
              <q-radio
                v-model="restricted"
                label="Everyone"
                val="all"
                name="restricted"
                class="q-mb-md"
                inline
              />
              <q-radio
                v-model="restricted"
                label="Admin Only"
                val="admin"
                name="restricted"
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
