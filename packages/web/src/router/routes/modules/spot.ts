import { RouteRecordRaw } from 'vue-router';
import { DEFAULT_LAYOUT } from '../base';

const SPOT_ROUTE: RouteRecordRaw = {
  path: '/spot',
  component: DEFAULT_LAYOUT,
  meta: {
    requiresAuth: false,
  },
  children: [
    {
      path: ':spotId',
      name: 'spot',
      component: () => import('@/views/spot/index.vue'),
      meta: {
        requiresAuth: false,
      },
    },
  ],
};

export default SPOT_ROUTE;
