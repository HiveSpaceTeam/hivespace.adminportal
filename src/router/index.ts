import { useAuth, ServerError, Maintenance, NotFound, Default, demoRoutes } from '@hivespace/shared'
import { createRouter, createWebHistory } from 'vue-router'

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
    component: ServerError,
    meta: { title: 'Server Error', allowAnonymous: true },
  },
  {
    path: '/maintenance',
    name: 'Maintenance',
    component: Maintenance,
    meta: { title: 'Maintenance', allowAnonymous: true },
  },
  {
    path: '/',
    name: 'Default',
    component: Default,
    props: { redirectPath: '/account/user-management', showSignUp: false },
    meta: { title: 'HiveSpace - Admin Portal', allowAnonymous: true },
  },
  ...demoRoutes.map((route) => {
    // Override the icons route to use local component
    if (route.path === '/demo' && route.children) {
      const children = route.children.map((child) => {
        if (child.path === 'icons') {
          return {
            ...child,
            component: () => import('@/views/Icons.vue'),
          }
        }
        return child
      })

      // If icons route is missing, explicit add it
      if (!children.some((c) => c.path === 'icons')) {
        children.push({
          path: 'icons',
          name: 'Icons',
          component: () => import('@/views/Icons.vue'),
          meta: { title: 'Icons' },
        })
      }

      return {
        ...route,
        component: () => import('@/views/DemoWrapper.vue'),
        children,
      }
    }
    return { ...route, component: () => import('@/views/DemoWrapper.vue') }
  }),
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: NotFound,
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

  // Use the composable for auth operations
  const { getCurrentUser, login, logout } = useAuth()

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
