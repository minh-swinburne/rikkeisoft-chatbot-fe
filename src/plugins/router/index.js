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
    path: '/auth',
    name: 'auth',
    component: () => import('@/views/auth/AuthView.vue'),
    children: [
      {
        path: 'login',
        name: 'auth-login',
        component: () => import('@/views/auth/AuthLogin.vue'),
      },
      {
        path: 'register',
        name: 'auth-register',
        component: () => import('@/views/auth/AuthRegister.vue'),
      },
    ],
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
    meta: { requiresAuth: true, requiresAdmin: true },
  },
  {
    path: '/settings',
    name: 'settings',
    component: () => import('@/views/settings/SettingsView.vue'),
    meta: { requiresAuth: true },
    children: [
      {
        path: 'profile',
        name: 'settings-profile',
        component: () => import('@/views/settings/SettingsProfile.vue'),
      },
      {
        path: 'auth',
        name: 'settings-auth',
        component: () => import('@/views/settings/SettingsAuth.vue'),
      },
    ],
  },
  {
    path: '/user',
    name: 'user',
    component: () => import('@/views/user/UserView.vue'),
    meta: { requiresAuth: true, requiresAdmin: true },
    children: [
      {
        path: 'list',
        name: 'user-list',
        component: () => import('@/views/user/UserList.vue'),
      },
      {
        path: 'profile/:userId',
        name: 'user-profile',
        component: () => import('@/views/user/UserProfile.vue'),
      },
    ],
  },
  {
    path: '/error',
    name: 'error',
    component: () => import('@/views/error/ErrorView.vue'),
    children: [
      {
        path: '404',
        name: 'error-404',
        component: () => import('@/views/error/ErrorNotFound.vue'),
      },
      {
        path: '403',
        name: 'error-403',
        component: () => import('@/views/error/ErrorAccessDenied.vue'),
      },
    ],
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: { name: 'error-404' },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach(async (to, from, next) => {
  // console.log('Checking if user is authenticated...')
  // console.log('From:', from)
  // console.log('To:', to)

  const authStore = useAuthStore()
  const isValidToken = await authStore.validateAccess()
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth)
  const requiresAdmin = to.matched.some((record) => record.meta.requiresAdmin)

  if (requiresAuth && !isValidToken) {
    next({ name: 'auth-login' })
    return
  }
  if (isValidToken && !authStore.isAuthenticated) {
    authStore.hydrateUser()
  }
  if (requiresAdmin && !authStore.isAdmin) {
    next({ name: 'error-403' })
    return
  }

  const route = router.getRoutes().find((route) => route.name === to.name)
  // Redirect to the first child route if it exists
  if (route.children.length > 0) {
    next(`${route.path}/${route.children[0].path}`)
  } else {
    next()
  }
})

export default router
