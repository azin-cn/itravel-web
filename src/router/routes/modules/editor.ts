import { RouteRecordRaw } from 'vue-router';
import { DEFAULT_LAYOUT } from '../base';

export const EDITOR_ROUTE: RouteRecordRaw = {
  path: '/editor',
  name: '',
  component: DEFAULT_LAYOUT,
  meta: {
    requiresAuth: true,
  },
  children: [
    {
      path: 'draft/:articleId?',
      component: () => import('@/views/editor/index.vue'),
      meta: {
        requiresAuth: true,
      },
    },
  ],
};

export default EDITOR_ROUTE;
