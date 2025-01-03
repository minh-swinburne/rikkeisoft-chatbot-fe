import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "@/stores/auth";

const routes = [
  { path: "/login", component: () => import("@/components/LoginPage.vue") },
  { path: "/register", component: () => import("@/components/RegisterPage.vue") },
  { path: "/chat", component: () => import("@/components/ChatPage.vue") },
  { path: "/upload", component: () => import("@/components/UploadPage.vue") },
  { path: "/documents", component: () => import("@/components/DocList.vue") },
  { path: "/", redirect: "/login" }, // Default route
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();

  if (to.path === "/login") {
    if (authStore.user) {
      // Redirect to chat if already logged in
      next("/chat");
    } else {
      next();
    }
  } else if (to.path === "/chat") {
    if (!authStore.user) {
      // Redirect to login if not logged in
      next("/login");
    } else {
      next();
    }
  } else {
    next(); // Allow navigation to other routes
  }
});

export default router;