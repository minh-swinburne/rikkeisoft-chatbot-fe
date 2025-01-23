import { useAuthStore } from "@/plugins/stores/auth";
import { createRouter, createWebHistory } from "vue-router";
import APIClient from '@/api.js'

const routes = [
  {
    path: "/home", component: () => import("@/pages/HomePage.vue")
  },
  { path: "/login", component: () => import("@/pages/LoginPage.vue"), meta: { requiresAuth: false } },
  {
    path: "/register",
    component: () => import("@/pages/RegisterPage.vue"),
  },
  {
    path: "/chat",
    component: () => import("@/pages/chats/ChatPage.vue"),
    meta: { requiresAuth: true },
    children: [
      {
        path: "",
        component: () => import("@/pages/chats/ChatStart.vue"),
      },
      {
        path: ":chatId",
        component: () => import("@/pages/chats/ChatDetail.vue"),
      },
    ],
  },
  {
    path: "/upload",
    component: () => import("@/pages/UploadPage.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/docs",
    component: () => import("@/pages/DocList.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/config",
    component: () => import("@/pages/ConfigPage.vue"),
    meta: { requiresAuth: false },
  },
  { path: "/", redirect: "/login" }, // Default route
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

async function checkTokenValidity() {
  const hasToken =
    !! localStorage.getItem("access_token") &&
    !! localStorage.getItem("refresh_token");

  if (!hasToken) {
    console.warn("No token found in cookies. User is not logged in.");
    return false;
  }

  try {
    const response = await APIClient.validateToken();
    return response.data.valid;
  } catch (error) {
    console.error("Token validation failed:", error.response?.data || error);
    return false;
  }
}

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();
  authStore.hydrateUser();

  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);

  const isValidToken = await checkTokenValidity();

  if (requiresAuth && !isValidToken) {
    next("/login");
  } else {
    next();
  }
});

export default router;
