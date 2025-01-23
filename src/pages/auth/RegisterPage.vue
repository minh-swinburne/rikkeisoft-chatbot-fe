<template>
  <q-page class="flex flex-center bg-dark">
    <div class="q-pa-xl">
      <q-card class="my-card">
        <q-card-section>
          <div class="q-mb-md q-gutter-md flex flex-center">
            <q-img src="rikkeisoft.png" alt="Rikkeisoft logo" height="80px" />
          </div>

          <q-form @submit.prevent="register">
            <q-input
              v-model="username"
              autocomplete="username"
              label="Username"
              outlined
              autofocus
              required
              :class="{'q-mb-md': !!isInvalidUsername}"
              :error="!!isInvalidUsername"
              :error-message="isInvalidUsername"
            />
            <div class="row q-col-gutter-sm">
              <div class="col-6">
                <q-input
                  v-model="firstname"
                  autocomplete="given-name"
                  label="First Name"
                  outlined
                  required
                  :class="{'q-mb-md': firstname.length == 0}"
                  :rules="[val => val && val.length > 0 || 'First name is required']"
                />
              </div>
              <div class="col-6">
                <q-input
                  v-model="lastname"
                  autocomplete="family-name"
                  label="Last Name (Optional)"
                  outlined
                />
              </div>
            </div>
            <div class="row q-col-gutter-sm items-center">
              <div class="col">
                <q-input
                  v-model="email"
                  autocomplete="email"
                  label="Email"
                  type="email"
                  outlined
                  required
                  :class="{'q-mb-md': !!isInvalidEmail}"
                  :error="!!isInvalidEmail"
                  :error-message="isInvalidEmail"
                />
              </div>
            </div>
            <div class="row q-col-gutter-sm">
              <div class="col-6">
                <q-input
                  v-model="password"
                  autocomplete="new-password"
                  label="Password"
                  outlined
                  required
                  :type="isPwd ? 'password' : 'text'"
                  :class="{'q-mb-md': password.length == 0}"
                  :rules="[val => val && val.length > 0 || 'Password is required']">
                  <template v-slot:append>
                    <q-icon
                      :name="isPwd ? 'visibility_off' : 'visibility'"
                      class="cursor-pointer"
                      @click="isPwd = !isPwd"
                    />
                  </template>
                </q-input>
              </div>
              <div class="col-6">
                <q-input
                  v-model="confirmPassword"
                  autocomplete="new-password"
                  label="Confirm Password"
                  type="password"
                  outlined
                  required
                  :class="{'q-mb-md': confirmPassword.length == 0 || password !== confirmPassword}"
                  :rules="[
                    val => val && val.length > 0 || 'Confirm password is required',
                    val => val === password || 'Passwords do not match'
                  ]"
                />
              </div>
            </div>
            <div class="q-mt-md login-btn">
              <q-btn type="submit" label="Register" color="primary" class="full-width" />
            </div>
          </q-form>

          <q-btn
            class="q-mt-md login-btn"
            @click="handleGoogleLogin"
            no-caps
            flat
          >
            <template v-slot:default>
              <div class="row items-center no-wrap">
                <q-icon name="img:https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" size="18px" class="q-mr-sm" />
                <div>Continue with Google</div>
              </div>
            </template>
          </q-btn>
          <q-btn
            class="q-mt-md login-btn"
            @click="handleMicrosoftLogin"
            no-caps
            flat
          >
            <template v-slot:default>
              <div class="row items-center no-wrap">
                <q-icon name="img:https://learn.microsoft.com/en-us/azure/active-directory/develop/media/howto-add-branding-in-azure-ad-apps/ms-symbollockup_mssymbol_19.png" size="18px" class="q-mr-sm" />
                <div>Continue with Microsoft</div>
              </div>
            </template>
          </q-btn>

          <div class="row items-center justify-center q-mt-md">
            <p>Already have an account?</p>
            <q-btn
              to="/login"
              flat
              color="primary"
              label="Login"
            />
          </div>
        </q-card-section>
      </q-card>
    </div>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { googleTokenLogin } from "vue3-google-login";
import { useRouter } from "vue-router";
import { useQuasar } from "quasar";
import { useAuthStore } from "@/plugins/stores/auth";
import { loginRequest, msalInstance } from "@/plugins/config/msalConfig";
import { apiClient } from "@/plugins/api";

const $router = useRouter();
const $q = useQuasar();
const authStore = useAuthStore();

const username = ref("");
const firstname = ref("");
const lastname = ref("");
const email = ref("");
const password = ref("");
const confirmPassword = ref("");
const isPwd = ref(true);

const isInvalidUsername = computed(() => {
  if (username.value.length === 0) return "Username is required";
  return /^[a-zA-Z][a-zA-Z0-9_]{3,20}$/.test(username.value) ? false : "Username must start with a letter and contain only alphanumeric characters or underscores";
});
const isInvalidEmail = computed(() => {
  if (email.value.length === 0) return "Email is required";
  return /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email.value) ? false : "Invalid email address";
});


async function register() {
  if (password.value !== confirmPassword.value) {
    alert("Passwords do not match!");
    return;
  }

  try {
    const userDetails = {
      username: username.value,
      firstname: firstname.value,
      lastname: lastname.value,
      email: email.value,
      password: password.value
    }
    const response = await apiClient.auth.registerUser(userDetails);

    if (response.status === 201) {
      alert("Registration successful!");
      $router.push("/login");
    } else {
      alert("Failed to register. Please try again.");
    }
  } catch (error) {
    console.error("Registration failed", error);
    alert("An error occurred while registering. Please try again.");
  }
}


async function handleGoogleLogin() {
  try {
    const googleUser = await googleTokenLogin();

    const response = await apiClient.auth.authenticateGoogle(googleUser.access_token);

    const { access_token, refresh_token } = response.data;
    authStore.login(access_token, refresh_token);

    $router.push("/chat");
  } catch (error) {
    console.error("Google login failed", error);
    authStore.logout();
  }
}

async function handleMicrosoftLogin() {
  try {
    await msalInstance.initialize();
    const loginResponse = await msalInstance.loginPopup(loginRequest);

    const response = await apiClient.auth.authenticateMicrosoft(loginResponse);

    const { access_token, refresh_token } = response.data;
    authStore.login(access_token, refresh_token);

    $router.push("/chat");
  } catch (error) {
    authStore.logout();
    console.error("Microsoft login failed:", error);
  }
}


onMounted(() => {
  $q.dark.set(false);
});
</script>

<style scoped>
.my-card {
  width: 600px;
  padding: 20px;
}

.q-img {
  max-width: 150px;
  margin-bottom: 8px;
}

.q-page {
  min-height: 100vh;
  background-color: #f5f5f5;
  display: flex;
  justify-content: center;
  align-items: center;
}

.q-btn {
  width: 100%;
  margin: 0;
  justify-content: center;
}

.login-btn {
  background-color: #ffffff;
  color: #5e5e5e;
  border: 1px solid #8c8c8c;
  margin-bottom: 10px;
}
</style>
