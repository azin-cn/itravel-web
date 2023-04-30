import { RouteRecordRaw } from 'vue-router';
import { DEFAULT_LAYOUT } from '../base';

const ARTICLE_ROUTE: RouteRecordRaw = {
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
};

export default ARTICLE_ROUTE;
