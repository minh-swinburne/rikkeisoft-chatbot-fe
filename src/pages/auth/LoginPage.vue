<template>
  <q-page class="flex flex-center bg-dark">
    <div class="q-pa-xl">
      <q-card class="my-card">
        <q-card-section>
          <div class="q-mb-md q-gutter-md flex flex-center">
            <q-img src="rikkeisoft.png" alt="Rikkeisoft logo" height="80px" />
          </div>

          <q-form @submit.prevent="handleNativeLogin">
            <q-input
              v-model="username"
              label="Username / Email"
              outlined
              autofocus
              required
              :class="{'q-mb-md': username.length == 0}"
              :rules="[val => val && val.length > 0 || 'Username or Email is required']"
            />
            <q-input
              v-model="password"
              autocomplete="current-password"
              label="Password"
              outlined
              required
              :type="isPwd ? 'password' : 'text'"
              :class="{'q-mb-md': password.length == 0}"
              :rules="[val => val && val.length > 0 || 'Password is required']"
            >
              <template v-slot:append>
                <q-icon
                  :name="isPwd ? 'visibility_off' : 'visibility'"
                  class="cursor-pointer"
                  @click="isPwd = !isPwd"
                />
              </template>
            </q-input>
            <div class="q-mt-md">
              <q-btn
                :loading="loading"
                type="submit"
                label="Login"
                color="primary"
                class="full-width"
                unelevated
              />
            </div>
          </q-form>

          <div class="q-mt-md">
            <q-btn
              :loading="loading"
              no-caps
              outline
              @click="handleGoogleLogin"
            >
              <template v-slot:default>
                <div class="row no-wrap">
                  <q-icon name="img:https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" size="18px" class="q-mr-sm" />
                  <div>Continue with Google</div>
                </div>
              </template>
            </q-btn>
          </div>
          <div class="q-mt-md">
            <q-btn
              :loading="loading"
              no-caps
              outline
              @click="handleMicrosoftLogin"
            >
              <template v-slot:default>
                <div class="row no-wrap">
                  <q-icon name="img:https://learn.microsoft.com/en-us/azure/active-directory/develop/media/howto-add-branding-in-azure-ad-apps/ms-symbollockup_mssymbol_19.png" size="18px" class="q-mr-sm" />
                  <div>Continue with Microsoft</div>
                  <q-space />
                </div>
              </template>
            </q-btn>
          </div>

          <div class="row items-center justify-center q-mt-md">
            <p>Don't have an account?</p>
            <q-btn
              to="/register"
              color="primary"
              label="Register"
              flat
            />
          </div>
        </q-card-section>

      </q-card>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useQuasar } from "quasar";
import { useRouter } from "vue-router";
import { googleTokenLogin } from "vue3-google-login";
import { apiClient } from "@/plugins/api";
import { useAuthStore } from "@/plugins/stores/auth";
import { loginRequest, msalInstance } from "@/plugins/config/msalConfig";

const $q = useQuasar();
const $router = useRouter();
const authStore = useAuthStore();

const username = ref("");
const password = ref("");
const isPwd = ref(true);
const loading = ref(false);

async function handleNativeLogin() {
  try {
    loading.value = true;

    const params = new URLSearchParams();
    params.append("username", username.value);
    params.append("password", password.value);

    const response = await apiClient.auth.authenticateNative(params);
    const { access_token, refresh_token } = response.data;

    authStore.login(access_token, refresh_token);
    loading.value = false;

    $q.notify({
      color: "positive",
      icon: "check_circle",
      message: "Login successful!",
    });
    $router.push("/chat");
  } catch (error) {
    loading.value = false;
    console.error("Login failed", error);
  }
}

async function handleGoogleLogin() {
  try {
    loading.value = true;

    const googleUser = await googleTokenLogin();
    const response = await apiClient.auth.authenticateGoogle(googleUser.access_token);
    const { access_token, refresh_token } = response.data;

    authStore.login(access_token, refresh_token);
    loading.value = false;

    $q.notify({
      color: "positive",
      icon: "check_circle",
      message: response.status === 200 ? "Login successful!" : "Registration successful!",
    });
    $router.push("/chat");
  } catch (error) {
    loading.value = false;
    console.error("Google login failed", error);
    authStore.logout();
  }
}

async function handleMicrosoftLogin() {
  try {
    loading.value = true;
    await msalInstance.initialize();

    const loginResponse = await msalInstance.loginPopup(loginRequest);
    const response = await apiClient.auth.authenticateMicrosoft(loginResponse.accessToken, loginResponse.idToken);
    const { access_token, refresh_token } = response.data;

    authStore.login(access_token, refresh_token);
    loading.value = false;

    $q.notify({
      color: "positive",
      icon: "check_circle",
      message: response.status === 200 ? "Login successful!" : "Registration successful!",
    });
    $router.push("/chat");
  } catch (error) {
    loading.value = false;
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
  background-color: black; /* Set background to black */
  display: flex;
  justify-content: center;
  align-items: center;
}

.row {
  display: flex;
  align-items: center;
}

.q-btn {
  width: 100%;
  margin: 0;
  justify-content: center;
}

p {
  margin: 0px;
}
</style>
