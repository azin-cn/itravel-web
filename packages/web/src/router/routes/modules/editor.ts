import { RouteRecordRaw } from 'vue-router';
import { DEFAULT_LAYOUT } from '../base';

export const EDITOR_ROUTE: RouteRecordRaw = {
  path: '/editor',
  component: DEFAULT_LAYOUT,
  meta: {
    requiresAuth: true,
  },
  children: [
    {
      path: '',
      redirect: '/',
    },
    {
      path: 'draft/:articleId?',
      name: 'editor',
      component: () => import('@/views/editor/index.vue'),
      meta: {
        requiresAuth: true,
      },
    },
  ],
};

export default EDITOR_ROUTE;
