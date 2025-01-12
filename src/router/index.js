import axios from "axios";
// import { useAuthStore } from "@/stores/auth";
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
  // const hasToken = document.cookie.includes("access_token"); // Check if access_token exists in cookies
  const hasToken =
    !! localStorage.getItem("access_token") &&
    !! localStorage.getItem("refresh_token");
  // console.log(hasToken);
  if (!hasToken) {
    console.warn("No token found in cookies. User is not logged in.");
    return false;
  }

  try {
    // Send a request to the backend to validate the token
    const response = await axios.get(
      "http://localhost:8000/api/v1/auth/validate",
      {
        withCredentials: true, // Include cookies in the request,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      }
    );

    // If the request succeeds, the token is valid
    return response.data.valid;
  } catch (error) {
    console.error("Token validation failed:", error.response?.data || error);
    return false;
  }
}

router.beforeEach(async (to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);

  // Check token validity for all pages
  const isValidToken = await checkTokenValidity();

  // If the route requires authentication and the token is invalid, redirect to login
  if (requiresAuth && !isValidToken) {
    next("/login");
  // } else if (to.path === "/login" && isValidToken) {
  //   // If already logged in, redirect to the default authenticated route (e.g., chat page)
  //   next("/chat");
  } else {
    next(); // Proceed to the route
  }
});

// axios.interceptors.response.use(
//   response => response,
//   async error => {
//     const originalRequest = error.config;

//     if (error.response.status === 401 && !originalRequest._retry) {
//       originalRequest._retry = true;

//       // Attempt to refresh the token
//       try {
//         const authStore = useAuthStore();
//         await authStore.refreshAccess();

//         // Retry the original request
//         return axios(originalRequest);
//       } catch (refreshError) {
//         console.error("Token refresh failed:", refreshError);
//         router.push("/login"); // Redirect to login
//       }
//     }

//     return Promise.reject(error);
//   }
// );


export default router;
