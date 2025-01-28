import { apiClient } from '@/plugins/api'
import { useAuthStore } from '@/plugins/stores/auth'
import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  { path: '/', redirect: '/home' }, // Default route
  {
    path: '/home',
    component: () => import('@/views/HomeView.vue'),
  },
  {
    path: '/login',
    component: () => import('@/views/auth/LoginView.vue'),
    meta: { requiresAuth: false },
  },
  {
    path: '/register',
    component: () => import('@/views/auth/RegisterView.vue'),
  },
  {
    path: '/chat',
    component: () => import('@/views/chat/ChatView.vue'),
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        component: () => import('@/views/chat/ChatStart.vue'),
      },
      {
        path: ':chatId',
        component: () => import('@/views/chat/ChatDetail.vue'),
      },
    ],
  },
  {
    path: '/docs',
    // component: () => import("@/views/docs/DocsView.vue"),
    meta: { requiresAuth: true, requiresAdmin: true },
    children: [
      {
        path: '/list',
        component: () => import('@/views/docs/DocsList.vue'),
      },
      {
        path: '/upload',
        component: () => import('@/views/docs/DocsUpload.vue'),
      },
    ],
  },
  {
    path: '/config',
    component: () => import('@/views/ConfigView.vue'),
    meta: { requiresAuth: false, requiresAdmin: true },
  },
  {
    path: '/profile',
    component: () => import('@/views/ProfileView.vue'),
    meta: { requiresAuth: true },
    children: [
      {
        path: '/me',
        // component: () => import("@/views/profile/ProfileDetail.vue"),
      },
      {
        path: '/:userId',
        // component: () => import("@/views/profile/ProfileDetail.vue"),
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

async function checkTokenValidity() {
  const hasToken = !!localStorage.getItem('access_token') && !!localStorage.getItem('refresh_token')

  if (!hasToken) {
    console.warn('No token found in cookies. User is not logged in.')
    return false
  }

  try {
    if (!apiClient.client.getToken()) {
      apiClient.client.setToken(localStorage.getItem('access_token'))
    }
    const response = await apiClient.auth.validateToken()
    return response.data.valid
  } catch (error) {
    console.error('Token validation failed:', error.response?.data || error)
    return false
  }
}

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth)
  const isValidToken = await checkTokenValidity()

  if (isValidToken && !authStore.isAuthenticated) {
    authStore.hydrateUser()
    next()
  } else if (requiresAuth && !isValidToken) {
    next('/login')
  } else {
    next()
  }
})

export default router
