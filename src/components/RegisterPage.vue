<template>
  <div class="main-container">
    <div class="register-container">
      <div class="form-container">
        <form @submit.prevent="register">
          <div class="logo-container">
            <img alt="Vue logo" src="@/assets/rikkeisoft.png" height="100" />
          </div>
          <div class="field-container">
            <div class="label-container col-4">
              <label for="username">Username:</label>
            </div>
            <div class="input-container col-8">
              <input v-model="username" id="username" type="text" class="form-field" required />
            </div>
          </div>
          <div class="field-container">
            <div class="label-container col-4">
              <label for="email">Email:</label>
            </div>
            <div class="input-container col-8">
              <input v-model="email" id="email" type="email" class="form-field" required />
            </div>
          </div>
          <div class="field-container">
            <div class="label-container col-4">
              <label for="password">Password:</label>
            </div>
            <div class="input-container col-8">
              <input v-model="password" id="password" type="password" class="form-field" required />
            </div>
          </div>
          <div class="submit-button-container">
            <input type="submit" value="Register" class="button" />
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import axios from "axios";
import { ref } from "vue";
import { hashSync } from "bcryptjs";

const username = ref("");
const email = ref("");
const password = ref("");

async function register() {
  try {
    // Hash the password
    const hashedPassword = hashSync(password.value, 10);

    // Prepare the user data
    const newUser = {
      username: username.value,
      email: email.value,
      password: hashedPassword,
    };

    // Send a POST request to the backend
    const response = await axios.post("http://localhost:3000/users", newUser);

    if (response.status === 201) {
      alert("Registration successful!");
    } else {
      alert("Failed to register. Please try again.");
    }
  } catch (error) {
    console.error(error);
    alert("An error occurred while registering. Please try again.");
  }
}
</script>

<style scoped>
/* General Styles */
.main-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #ccc;
}

.register-container {
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

.field-container {
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

input[type="submit"]:hover {
  /* transform: scale(1.05); */
}

button {
  padding: 0.5rem 1rem;
  border: 1px solid transparent;
  border-radius: 4px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.2s;
}

.button:hover {
  transform: scale(1.05);
}
</style>
