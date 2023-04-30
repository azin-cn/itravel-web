import { RouteRecordRaw } from 'vue-router';
import { DEFAULT_LAYOUT } from '../base';

export const SEARCH_ROUTE: RouteRecordRaw = {
  path: '/search',
  component: DEFAULT_LAYOUT,
  meta: {
    requiresAuth: false,
  },
  children: [
    {
      path: '',
      name: 'search',
      component: () => import('@/views/search/index.vue'),
      meta: {
        requiresAuth: false,
      },
    },
  ],
};

export default SEARCH_ROUTE;
