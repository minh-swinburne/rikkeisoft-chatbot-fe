import axios from "axios";
import { useAuthStore } from "@/stores/auth";
import { createRouter, createWebHistory } from "vue-router";

const routes = [
  { path: "/login", component: () => import("@/components/LoginPage.vue"), meta: { requiresAuth: false } },
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

async function checkTokenValidity() {
  const hasToken =
    !! localStorage.getItem("access_token") &&
    !! localStorage.getItem("refresh_token");

  if (!hasToken) {
    console.warn("No token found in cookies. User is not logged in.");
    return false;
  }

  try {
    const response = await axios.get(
      "http://localhost:8000/api/v1/auth/validate",
      {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      }
    );
    return response.data.valid;
  } catch (error) {
    console.error("Token validation failed:", error.response?.data || error);
    return false;
  }
}

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();

  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);

  const isValidToken = await checkTokenValidity();
  console.log("isValidToken: ", isValidToken);

  if (isValidToken && !authStore.isAuthenticated) {
    authStore.login(localStorage.getItem("access_token"), localStorage.getItem("refresh_token"));
    next();
  }
  else if (requiresAuth && !isValidToken) {
    next("/login");
  } else {
    next();
  }
});

export default router;
