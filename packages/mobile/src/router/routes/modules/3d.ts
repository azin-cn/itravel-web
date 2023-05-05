import { RouteRecordRaw } from 'vue-router';

export const THREE_ROUTE: RouteRecordRaw = {
  name: '3d',
  path: '/3d/:spotId',
  component: () => import('@/views/3d/index.vue'),
  meta: {
    requiresAuth: false,
  },
};

export default THREE_ROUTE;
