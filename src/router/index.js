import { createRouter, createWebHistory } from "vue-router";

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

export default router;