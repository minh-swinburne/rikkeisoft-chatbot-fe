<template>
  <div class="main-container bg-light">
    <div class="login-container">
      <div class="form-container">
        <form @submit.prevent="login">
          <div class="logo-container">
            <img alt="Vue logo" src="rikkeisoft.png" height="100" />
          </div>
          <div class="username-container">
            <div class="label-and-logo-username-container col-4">
              <div class="username-logo"></div>
              <label for="username"> Username: </label>
            </div>
            <div class="username-input-container col-8">
              <input
                v-model="username"
                id="username"
                type="text"
                class="form-field"
                required
              />
            </div>
          </div>

          <div class="password-container">
            <div class="label-and-logo-password-container col-4">
              <div class="password-logo"></div>
              <label for="password"> Password: </label>
            </div>
            <div class="password-input-container col-8">
              <input
                v-model="password"
                id="password"
                type="password"
                class="form-field"
                required
              />
            </div>
          </div>
          <div class="submit-button-container">
            <input type="submit" value="Login" class="button" />
          </div>
        </form>
      </div>
      <div class="login-via-other">
        <div class="via-gmail-container">
          <button class="button" @click="handleGoogleLogin">
            Login Via Google
          </button>
        </div>
        <div class="via-microsoft-container">
          <button class="button" @click="handleMicrosoftLogin">
            Login Via Microsoft
          </button>
        </div>
      </div>
    </div>
  </div>
  x
</template>

<script setup>
import { useAuthStore } from "@/stores/auth";
import * as msal from "@azure/msal-browser";
import axios from "axios";
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { googleTokenLogin } from "vue3-google-login";

const $router = useRouter();
const authStore = useAuthStore();

const username = ref("");
const password = ref("");

async function login() {
  try {
    const params = new URLSearchParams();
    params.append("username", username.value);
    params.append("password", password.value);

    const response = await axios.post(
      "http://127.0.0.1:8000/api/v1/auth/native",
      params,
      {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        withCredentials: true, // Ensure cookies are sent with the request
      }
    );

    console.log("Response:", response.data);
    authStore.login(response.data.access_token);
    console.log("Login successfully");

    // Redirect to the /chat route after a successful login
    $router.push("/chat");
  } catch (error) {
    console.error("Login failed", error);
  }
}

const handleGoogleLogin = async () => {
  try {
    const googleUser = await googleTokenLogin();

    const response = await axios.get(
      "http://127.0.0.1:8000/api/v1/auth/google",
      {
        params: { access_token: googleUser.access_token },
      }
    );

    authStore.login(response.data.access_token);

    console.log("Google login successful");
    console.log("Response:", response.data);

    $router.push("/chat");
  } catch (error) {
    console.error("Google login failed", error);
  }
};

const msalInstance = ref(null);

onMounted(() => {
  msalInstance.value = new msal.PublicClientApplication({
    auth: {
      clientId: "",
      authority: "",
      redirectUri: "",
    },
  });
});

const handleMicrosoftLogin = async () => {
  try {
    const loginResponse = await msalInstance.value.loginPopup({
      scopes: ["user.read"],
    });

    const response = await axios.post("http://127.0.0.1:8000/microsoft-login", {
      token: loginResponse.accessToken,
    });

    const token = response.data.access_token;
    localStorage.setItem("jwt", token);
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    console.log("Microsoft login successful");
    $router.push("/chat");
  } catch (error) {
    console.error("Microsoft login failed", error);
  }
};
</script>

<style scoped>
/* General Styles */
.main-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

.login-container {
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  max-width: 400px;
  width: 100%;
}

.button {
  background-color: #fff;
  box-shadow: 5px 10px rgba(0, 0, 0, 0.1);
}

/* Form Section */
.form-container {
  padding: 2rem;
}

.logo-container {
  text-align: center;
  margin-bottom: 1rem;
}

.username-container,
.password-container {
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
}

.username-logo,
.password-logo {
  margin-right: 10px;
  color: #6c757d;
  font-size: 1.2rem;
}

label {
  flex-grow: 1;
  font-weight: 500;
}

/* input[type="text"] { */
.form-field {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ced4da;
  border-radius: 4px;
}

.submit-button-container {
  text-align: center;
}

input[type="submit"] {
  width: 100%;
  padding: 0.7rem;
  border: 1px solid transparent;
  border-radius: 4px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.2s;
  border-color: #000000;
}

/* Login Via Other Services */
.login-via-other {
  padding: 1rem;
  background: #f8f9fa;
  border-top: 1px solid #dee2e6;
  display: flex;
  justify-content: space-around;
}

button {
  padding: 0.5rem 1rem;
  border: 1px solid transparent;
  border-radius: 4px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.2s;
}

.via-gmail-container button {
  border-color: #a43429;
}

.via-gmail-container button:hover {
}

.via-microsoft-container button {
  border-color: #005bb5;
}

.via-microsoft-container button:hover {
}

.button:hover {
  transform: scale(1.05);
}
</style>
