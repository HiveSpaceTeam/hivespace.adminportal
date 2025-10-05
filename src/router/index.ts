import { getCurrentUser, login, logout } from '@/auth/user-manager'
import { createRouter, createWebHistory } from 'vue-router'
import demoRoutes from './demoRoutes'

const mainRoutes = [
  // Determine post logout redirect path from config (use only the path portion)
  {
    path: '/callback/logout',
    name: 'LogoutCallback',
    component: () => import('@/views/Callback/LogoutCallback.vue'),
    meta: { allowAnonymous: true },
  },
  {
    path: '/callback/login',
    name: 'Callback',
    component: () => import('@/views/Callback/LoginCallback.vue'),
    meta: { allowAnonymous: true },
  },
  {
    path: '/server-error',
    name: 'ServerError',
    component: () => import('@/views/Pages/ServerError.vue'),
    meta: { title: 'Server Error', allowAnonymous: true },
  },
  {
    path: '/maintenance',
    name: 'Maintenance',
    component: () => import('@/views/Pages/Maintenance.vue'),
    meta: { title: 'Maintenance', allowAnonymous: true },
  },
  {
    path: '/',
    name: 'Default',
    component: () => import('@/views/Default.vue'),
    meta: { title: 'HiveSpace - Admin Portal', allowAnonymous: true },
  },
  ...demoRoutes,
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/Pages/NotFound.vue'),
    meta: { title: 'Not Found', allowAnonymous: true },
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior(to, from, savedPosition) {
    return savedPosition || { left: 0, top: 0 }
  },
  routes: [
    {
      path: '/account',
      children: [
        {
          path: '',
          redirect: '/account/user-management',
        },
        {
          path: 'user-management',
          name: 'User management',
          component: () => import('@/views/Accounts/UserManagement.vue'),
          meta: { title: 'User management' },
        },
        {
          path: 'admin-management',
          name: 'Admin management',
          component: () => import('@/views/Accounts/AdminManagement.vue'),
          meta: { title: 'Admin management' },
        },
      ],
    },
    ...mainRoutes,
  ],
})

export default router

router.beforeEach(async (to, from, next) => {
  document.title = `${to.meta.title}`
  if (to.meta.allowAnonymous) {
    next()
    return
  }
  const user = await getCurrentUser()
  if (!user) {
    login()
    return
  }
  // Allow access if the user is an admin OR a system admin.
  // Redirect to login when the user is neither.
  if (!user.isAdmin() && !user.isSystemAdmin()) {
    await logout()
    return next(false)
  }

  next()
})
