import { createApp } from 'vue'
import { createRouter, createWebHistory } from "vue-router";
import App from '../App.vue'
import vue3GoogleLogin from 'vue3-google-login'

const routes = [
  { path: "/login", component: () => import("@/components/LoginPage.vue") },
  {
    path: "/register",
    component: () => import("@/components/RegisterPage.vue"),
  },
  {
    path: "/chat",
    component: () => import("@/components/ChatPage.vue"),
    meta: { requiresAuth: true },
    children: [
      {
        path: "",
        component: () => import("@/components/ChatStart.vue"),
      },
      {
        path: ":chatId",
        component: () => import("@/components/ChatDetail.vue"),
      },
    ],
  },
  {
    path: "/upload",
    component: () => import("@/components/UploadPage.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/docs",
    component: () => import("@/components/DocList.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/config",
    component: () => import("@/components/ConfigPage.vue"),
    meta: { requiresAuth: false },
  },
  { path: "/", redirect: "/login" }, // Default route
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('jwt');
  
  if (to.matched.some(record => record.meta.requiresAuth)) {
    // Check if the route requires authentication
    if (!token) {
      // If there's no token, redirect to login
      next('/login');
    } else {
      // If there's a token, allow navigation
      next();
    }
  } else if (to.path === '/login' && token) {
    // If user is already logged in and tries to access login page, redirect to chat
    next('/chat');
  } else {
    // For routes that don't require auth (like login and register), allow navigation
    next();
  }
});

const app = createApp(App)

app.use(router)

app.use(vue3GoogleLogin, {
  clientId: '1047088098330-2d17mgbf5bdugkvkh69i0ah65c40hp65.apps.googleusercontent.com'
})

app.mount('#app')

export default router;