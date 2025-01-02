import { createApp } from 'vue'
import App from './App.vue'
import { createRouter, createWebHistory } from 'vue-router';

import ChatbotPage from './components/ChatbotPage.vue';
import LoginPage from './components/LoginPage.vue';


const routes = [
    { path: '/', component: ChatbotPage },  // This will be used for http://localhost:8080/
    { path: '/login', component: LoginPage },  // This will be used for http://localhost:8080/login
  ];


const router = createRouter({
    history: createWebHistory(),
    routes,
  });

createApp(App).use(router).mount('#app');
