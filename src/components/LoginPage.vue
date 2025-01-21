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
              label="Username"
              filled
              autofocus
              required
              :rules="[val => val && val.length > 0 || 'Username is required']"
            />
            <q-input
              v-model="password"
              label="Password"
              type="password"
              filled
              required
              :rules="[val => val && val.length > 0 || 'Password is required']"
            />
            <div class="q-mt-md login-btn">
              <q-btn type="submit" label="Login" color="primary" class="full-width" />
            </div>
          </q-form>

          <q-btn
            class="q-mt-md login-btn"
            @click="handleGoogleLogin"
            flat
          >
            <template v-slot:default>
              <div class="row items-center no-wrap">
                <q-icon name="img:https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" size="18px" class="q-mr-sm" />
                <div>Login with Google</div>
              </div>
            </template>
          </q-btn>
          <q-btn
            class="q-mt-md login-btn"
            @click="handleMicrosoftLogin"
            flat
          >
            <template v-slot:default>
              <div class="row items-center no-wrap">
                <q-icon name="img:https://learn.microsoft.com/en-us/azure/active-directory/develop/media/howto-add-branding-in-azure-ad-apps/ms-symbollockup_mssymbol_19.png" size="18px" class="q-mr-sm" />
                <div>Login with Microsoft</div>
              </div>
            </template>
          </q-btn>

          <div class="row items-center justify-center q-mt-md">
            <p>Don't have an account?</p>
            <q-btn
              to="/register"
              flat
              color="primary"
              label="Register"
            />
          </div>
        </q-card-section>

      </q-card>
    </div>
  </q-page>
</template>

<script setup>
import axios from "axios";
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import { googleTokenLogin } from "vue3-google-login";
import { loginRequest, msalInstance } from "@/config/msalConfig";
import { useQuasar } from 'quasar';

const $q = useQuasar();

const $router = useRouter();
const authStore = useAuthStore();

const username = ref("");
const password = ref("");

async function handleNativeLogin() {
  try {
    const params = new URLSearchParams();
    params.append("username", username.value);
    params.append("password", password.value);

    const response = await axios.post(
      "http://127.0.0.1:8000/api/v1/auth/native",
      params,
      {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        withCredentials: true,
      }
    );

    const { access_token, refresh_token } = response.data;
    authStore.login(access_token, refresh_token);

    $router.push("/chat");
  } catch (error) {
    console.error("Login failed", error);
  }
}

async function handleGoogleLogin() {
  try {
    const googleUser = await googleTokenLogin();

    const response = await axios.post(
      "http://127.0.0.1:8000/api/v1/auth/google",
      { access_token: googleUser.access_token },
      { headers: { "Content-Type": "application/json" } }
    );

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

    const response = await axios.post(
      "http://127.0.0.1:8000/api/v1/auth/microsoft",
      {
        access_token: loginResponse.accessToken,
        id_token: loginResponse.idToken,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${loginResponse.accessToken}`,
        },
      }
    );

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

.login-btn {
  background-color: #ffffff;
  color: #5e5e5e;
  border: 1px solid #8c8c8c;
  margin-bottom: 10px;
}

p{
  margin: 0px;
}
</style>
