import { RouteRecordRaw } from 'vue-router';
import { DEFAULT_LAYOUT } from '../base';

export const THREE_ROUTE: RouteRecordRaw = {
  path: '/3d',
  component: DEFAULT_LAYOUT,
  meta: {
    requiresAuth: false,
  },
  children: [
    {
      path: '',
      redirect: '/home',
    },
    {
      name: '3d',
      path: ':spotId',
      component: () => import('@/views/3d/index.vue'),
      meta: {
        requiresAuth: false,
      },
    },
  ],
};

export default THREE_ROUTE;
