import { apiClient } from "@/plugins/api";
import { useAuthStore } from "@/plugins/stores/auth";
import { createRouter, createWebHistory } from "vue-router";

const routes = [
  { path: "/", redirect: "/home" }, // Default route
  {
    path: "/home",
    component: () => import("@/pages/HomePage.vue"),
  },
  {
    path: "/login",
    component: () => import("@/pages/auth/LoginPage.vue"),
    meta: { requiresAuth: false },
  },
  {
    path: "/register",
    component: () => import("@/pages/auth/RegisterPage.vue"),
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
    component: () => import("@/pages/docs/DocUploadPage.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/docs",
    // component: () => import("@/pages/docs/DocListPage.vue"),
    meta: { requiresAuth: true, requiresAdmin: true },
    children: [
      {
        path: "/list",
        component: () => import("@/pages/docs/DocListPage.vue"),
      },
      {
        path: "/upload",
        component: () => import("@/pages/docs/DocUploadPage.vue"),
      },
    ],
  },
  {
    path: "/config",
    component: () => import("@/pages/ConfigPage.vue"),
    meta: { requiresAuth: false, requiresAdmin: true },
  },
  {
    path: "/profile",
    component: () => import("@/pages/ProfilePage.vue"),
    meta: { requiresAuth: true },
    children: [
      {
        path: "/me",
        // component: () => import("@/pages/profile/ProfileDetail.vue"),
      },
      {
        path: "/:userId",
        // component: () => import("@/pages/profile/ProfileDetail.vue"),
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

async function checkTokenValidity() {
  const hasToken =
    !!localStorage.getItem("access_token") &&
    !!localStorage.getItem("refresh_token");

  if (!hasToken) {
    console.warn("No token found in cookies. User is not logged in.");
    return false;
  }

  try {
    if (!apiClient.client.getToken()) {
      apiClient.client.setToken(localStorage.getItem("access_token"));
    }
    const response = await apiClient.auth.validateToken();
    return response.data.valid;
  } catch (error) {
    console.error("Token validation failed:", error.response?.data || error);
    return false;
  }
}

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);
  const isValidToken = await checkTokenValidity();

  if (isValidToken && !authStore.isAuthenticated) {
    authStore.hydrateUser();
    next();
  } else if (requiresAuth && !isValidToken) {
    next("/login");
  } else {
    next();
  }
});

export default router;
