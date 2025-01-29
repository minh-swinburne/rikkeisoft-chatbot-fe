import { useAuthStore } from '@/plugins/stores/auth'
import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  { path: '/', name: 'root', redirect: '/home' }, // Default route
  {
    path: '/home',
    name: 'home',
    component: () => import('@/views/HomeView.vue'),
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/auth/LoginView.vue'),
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('@/views/auth/RegisterView.vue'),
  },
  {
    path: '/chat',
    name: 'chat',
    component: () => import('@/views/chat/ChatView.vue'),
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        name: 'chat-start',
        component: () => import('@/views/chat/ChatStart.vue'),
      },
      {
        path: ':chatId',
        name: 'chat-detail',
        component: () => import('@/views/chat/ChatDetail.vue'),
      },
    ],
  },
  {
    path: '/docs',
    name: 'docs',
    component: () => import('@/views/docs/DocsView.vue'),
    meta: { requiresAuth: true, requiresAdmin: true },
    children: [
      {
        path: 'list',
        name: 'docs-list',
        component: () => import('@/views/docs/DocsList.vue'),
      },
      {
        path: 'upload',
        name: 'docs-upload',
        component: () => import('@/views/docs/DocsUpload.vue'),
      },
    ],
  },
  {
    path: '/config',
    name: 'config',
    component: () => import('@/views/ConfigView.vue'),
    meta: { requiresAuth: false, requiresAdmin: true },
  },
  {
    path: '/profile',
    name: 'profile',
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

router.beforeEach(async (to, from, next) => {
  console.log('Checking if user is authenticated...')
  const authStore = useAuthStore()
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth)
  const isValidToken = await authStore.validateAccess()

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
