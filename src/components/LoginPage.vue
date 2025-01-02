<template>
  <div class="main-container">
    <div class="login-container">
      <div class="form-container">
        <form>
          <div class="logo-container">
            <img alt="Vue logo" src="">
          </div>
          <div class="username-container">
            <div class="label-and-logo-username-container col-4">
              <div class="username-logo ">
      
              </div>
              <label for="username">
                Username: 
              </label>
            </div>
            <div class="username-input-container col-8">
              <input id="username" type="text">
            </div>
          </div>

          <div class="password-container">
            <div class="label-and-logo-password-container col-4">
              <div class="password-logo">
      
              </div>
              <label for="password">
                Password: 
              </label>
            </div>
            <div class="password-input-container col-8">
              <input id="password" type="text">
            </div>
          </div>
          <div class="submit-button-container">
            <input type="submit" value="Login">
          </div>
        </form>
      </div>
      <div class="login-via-other">
          <div class="via-gmail-container">
            <button>Login Via Google</button>
          </div>
          <div class="via-microsoft-container">
            <button>Login Via Microsoft</button>
          </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LoginPage',
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

input[type="text"] {
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
  transform: scale(1.05);
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

button:hover {
  transform: scale(1.05);
}

</style>
