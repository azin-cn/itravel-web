import {
  createRouter,
  createWebHistory,
  createWebHashHistory,
} from 'vue-router';
import NProgress from 'nprogress'; // progress bar
import 'nprogress/nprogress.css';

import { appRoutes } from './routes';
import { REDIRECT_MAIN, NOT_FOUND_ROUTE, DEFAULT_LAYOUT } from './routes/base';
import createRouteGuard from './guard';

NProgress.configure({ showSpinner: false }); // NProgress Configuration

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      redirect: '/home',
    },
    {
      path: '/home',
      name: 'home',
      component: () => import('@/views/home/index.vue'),
      meta: {
        requiresAuth: false,
      },
    },
    {
      path: '/article',
      component: DEFAULT_LAYOUT,
      meta: {
        requiresAuth: false,
      },
      children: [
        {
          name: 'article',
          path: ':articleId',
          component: () => import('@/views/article/index.vue'),
          meta: {
            requiresAuth: false,
          },
        },
      ],
    },
    {
      path: '/userinfo/:userId',
      name: 'userinfo',
      component: () => import('@/views/article/index.vue'),
      meta: {
        requiresAuth: false,
      },
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/login/index.vue'),
      meta: {
        requiresAuth: false,
      },
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('@/views/register/index.vue'),
      meta: {
        requiresAuth: false,
      },
    },
    ...appRoutes,
    REDIRECT_MAIN,
    NOT_FOUND_ROUTE,
  ],
  scrollBehavior() {
    return { top: 0 };
  },
});

createRouteGuard(router);

export default router;
