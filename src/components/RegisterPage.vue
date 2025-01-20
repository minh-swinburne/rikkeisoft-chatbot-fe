<template>
  <q-page class="flex flex-center bg-grey-2">
    <div class="q-pa-xl">
      <q-card class="my-card">
        <q-card-section>
          <div class="q-mb-md q-gutter-md flex flex-center">
            <q-img src="rikkeisoft.png" alt="Rikkeisoft logo" height="80px" />
          </div>

          <q-form @submit.prevent="register">
            <q-input
              v-model="username"
              label="Username"
              filled
              autofocus
              required
              :rules="[val => val && val.length > 0 || 'Username is required']"
            />
            <div class="row q-col-gutter-sm">
              <div class="col-6">
                <q-input
                  v-model="firstname"
                  label="First Name"
                  filled
                  required
                  :rules="[val => val && val.length > 0 || 'First name is required']"
                />
              </div>
              <div class="col-6">
                <q-input
                  v-model="lastname"
                  label="Last Name"
                  filled
                  required
                  :rules="[val => val && val.length > 0 || 'Last name is required']"
                />
              </div>
            </div>
            <div class="row q-col-gutter-sm items-center">
              <div class="col">
                <q-input
                  v-model="email"
                  label="Email"
                  type="email"
                  filled
                  required
                  :rules="[
                    val => val && val.length > 0 || 'Email is required',
                    val => val && /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(val) || 'Invalid email format'
                  ]"
                />
              </div>
              <div class="col-auto">
                <q-btn label="Send Code" color="primary" @click="sendVerificationCode" :disable="codeSent" />
              </div>
            </div>
            <div v-if="codeSent" class="row q-col-gutter-sm items-center">
              <div class="col">
                <q-input
                  v-model="verificationCode"
                  label="Verification Code"
                  filled
                  required
                  :rules="[val => val && val.length > 0 || 'Verification code is required']"
                />
              </div>
              <div class="col-auto">
                <q-btn label="Verify" color="primary" @click="verifyCode" />
              </div>
            </div>
            <div class="row q-col-gutter-sm">
              <div class="col-6">
                <q-input
                  v-model="password"
                  label="Password"
                  type="password"
                  filled
                  required
                  :rules="[val => val && val.length > 0 || 'Password is required']"
                />
              </div>
              <div class="col-6">
                <q-input
                  v-model="confirmPassword"
                  label="Confirm Password"
                  type="password"
                  filled
                  required
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
            <p class="q-mr-sm">Already have an account?</p>
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
import { ref } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";

const $router = useRouter();

const username = ref("");
const firstname = ref("");
const lastname = ref("");
const email = ref("");
const password = ref("");
const confirmPassword = ref("");
const verificationCode = ref("");
const codeSent = ref(false);

async function sendVerificationCode() {
  try {
    // Implement your logic to send verification code
    // For example:
    // await axios.post("http://127.0.0.1:8000/api/v1/auth/send-verification", { email: email.value });
    codeSent.value = true;
    alert("Verification code sent to your email!");
  } catch (error) {
    console.error("Failed to send verification code", error);
    alert("Failed to send verification code. Please try again.");
  }
}

async function verifyCode() {
  try {
    // Implement your logic to verify the code
    // For example:
    // const response = await axios.post("http://127.0.0.1:8000/api/v1/auth/verify-code", { email: email.value, code: verificationCode.value });
    // if (response.data.verified) {
    //   alert("Email verified successfully!");
    // } else {
    //   alert("Invalid verification code. Please try again.");
    // }
    alert("Code verification logic to be implemented");
  } catch (error) {
    console.error("Failed to verify code", error);
    alert("An error occurred while verifying the code. Please try again.");
  }
}

async function register() {
  if (password.value !== confirmPassword.value) {
    alert("Passwords do not match!");
    return;
  }

  try {
    const response = await axios.post(
      "http://127.0.0.1:8000/api/v1/auth/register",
      {
        username: username.value,
        firstname: firstname.value,
        lastname: lastname.value,
        email: email.value,
        password: password.value
      },
      {
        headers: { "Content-Type": "application/json" },
      }
    );

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

function handleGoogleLogin() {
  // Implement Google OAuth logic
  alert("Continue with Google logic to be implemented");
}

function handleMicrosoftLogin() {
  // Implement Microsoft OAuth logic
  alert("Continue with Microsoft logic to be implemented");
}
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

p{
  margin: 0px;
}
</style>

