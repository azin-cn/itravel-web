import { RouteRecordRaw } from 'vue-router';

const ARTICLE_ROUTE: RouteRecordRaw = {
  path: '/article/:articleId',
  name: 'article',
  component: () => import('@/views/article/index.vue'),
  meta: {
    requiresAuth: false,
  },
};

export default ARTICLE_ROUTE;
