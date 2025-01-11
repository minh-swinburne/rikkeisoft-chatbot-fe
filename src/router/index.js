import { createApp } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';
import axios from 'axios';
import App from '../App.vue';
import vue3GoogleLogin from 'vue3-google-login';

const routes = [
  { path: '/login', component: () => import('@/components/LoginPage.vue'), meta: { requiresAuth: false } },
  {
    path: '/register',
    component: () => import('@/components/RegisterPage.vue'),
  },
  {
    path: '/chat',
    component: () => import('@/components/ChatPage.vue'),
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        component: () => import('@/components/ChatStart.vue'),
      },
      {
        path: ':chatId',
        component: () => import('@/components/ChatDetail.vue'),
      },
    ],
  },
  {
    path: '/upload',
    component: () => import('@/components/UploadPage.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/docs',
    component: () => import('@/components/DocList.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/config',
    component: () => import('@/components/ConfigPage.vue'),
    meta: { requiresAuth: false },
  },
  { path: '/', redirect: '/login' }, // Default route
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

async function checkTokenValidity() {
  const token = localStorage.getItem('access_token');
  if (token) {
    try {
      await axios.get('http://localhost:8000/api/v1/users/me', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return true;
    } catch (error) {
      console.error('Token is invalid:', error);
      localStorage.removeItem('access_token');
      return false;
    }
  }
  return false;
}

router.beforeEach(async (to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  
  // Check token validity for all pages
  const isValidToken = await checkTokenValidity();
  
  // If the route requires authentication and the token is invalid, redirect to login
  if (requiresAuth && !isValidToken) {
    next('/login');
  } else if (to.path === '/login' && isValidToken) {
    // If already logged in, redirect to the default authenticated route (e.g., chat page)
    next('/chat');
  } else {
    next(); // Proceed to the route
  }
});

const app = createApp(App);

app.use(router);

app.use(vue3GoogleLogin, {
  clientId: '1047088098330-2d17mgbf5bdugkvkh69i0ah65c40hp65.apps.googleusercontent.com',
});

app.mount('#app');

export default router;
