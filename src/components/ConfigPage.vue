<template>
    <div class="main-container">
      <form @submit.prevent="handleSubmit">
        <div class="input-container">
          <label for="instructions">Instructions:</label>
          <textarea
            id="instructions"
            v-model="formData.instructions"
            name="instruction"
            rows="5"
            placeholder="Enter your instructions here..."
          ></textarea>
        </div>
        <div class="input-container">
          <label for="temperature">Temperature:</label>
          <input
            id="temperature"
            v-model="formData.temperature"
            type="number"
            step="0.1"
            min="0"
            max="1"
            placeholder="Enter temperature (0-1)"
          >
        </div>
        <div class="input-container">
          <label for="max-tokens">Max tokens:</label>
          <input
            id="max-tokens"
            v-model="formData.maxTokens"
            type="number"
            min="1"
            placeholder="Enter max tokens"
          >
        </div>
        <button type="submit">Apply</button>
      </form>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  
  const formData = ref({
    instructions: '',
    temperature: '',
    maxTokens: ''
  });
  
  const handleSubmit = () => {
    console.log('Form submitted:', formData.value);
    // Add your form submission logic here
  };
  </script>
  
  <style scoped>
  .main-container {
    max-width: 600px;
    margin: 2rem auto;
    padding: 2rem;
    background-color: #f8f9fa;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }
  
  form {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }
  
  .input-container {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
  
  label {
    font-weight: bold;
    color: #333;
  }
  
  textarea,
  input[type="number"] {
    width: 100%;
    padding: 0.5rem;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 1rem;
    transition: border-color 0.3s ease;
  }
  
  textarea:focus,
  input[type="number"]:focus {
    outline: none;
    border-color: #007bff;
  }
  
  button {
    align-self: flex-start;
    padding: 0.5rem 1rem;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    font-size: 1rem;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }
  
  button:hover {
    background-color: #0056b3;
  }
  
  @media (max-width: 480px) {
    .main-container {
      padding: 1rem;
    }
  
    form {
      gap: 1rem;
    }
  }
  </style>