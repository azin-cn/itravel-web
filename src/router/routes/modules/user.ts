import { RouteRecordRaw } from 'vue-router';
import { DEFAULT_LAYOUT } from '../base';

export const USER_ROUTE: RouteRecordRaw = {
  path: '/user',
  component: DEFAULT_LAYOUT,
  meta: {
    requiresAuth: false,
  },
  children: [
    {
      path: 'profile/:userId',
      name: 'userProfile',
      meta: {
        requiresAuth: true,
      },
      component: () => import('@/views/user/profile/index.vue'),
    },
    {
      path: ':userId',
      name: 'userPreview',
      component: () => import('@/views/user/preview/index.vue'),
      meta: {
        requiresAuth: false,
      },
    },
  ],
};

export default USER_ROUTE;
