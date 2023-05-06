import { DEFAULT_LAYOUT } from '../base';
import { AppRouteRecordRaw } from '../types';

const LIST: AppRouteRecordRaw = {
  path: '/list',
  name: 'list',
  component: DEFAULT_LAYOUT,
  redirect: '/list/search-spot',
  meta: {
    locale: 'menu.list',
    requiresAuth: true,
    icon: 'icon-list',
    order: 2,
  },
  children: [
    {
      path: 'search-spot', // The midline path complies with SEO specifications
      name: 'SearchSpot',
      component: () => import('@/views/list/search-table/index.vue'),
      meta: {
        locale: 'menu.list.searchSpot',
        requiresAuth: true,
        roles: ['*'],
      },
    },
    {
      path: 'search-article', // The midline path complies with SEO specifications
      name: 'SearchArticle',
      component: () => import('@/views/list/search-table/index.vue'),
      meta: {
        locale: 'menu.list.searchArticle',
        requiresAuth: true,
        roles: ['*'],
      },
    },
    {
      path: 'search-user', // The midline path complies with SEO specifications
      name: 'SearchUser',
      component: () => import('@/views/list/search-table/index.vue'),
      meta: {
        locale: 'menu.list.searchUser',
        requiresAuth: true,
        roles: ['*'],
      },
    },
    {
      path: 'search-comment', // The midline path complies with SEO specifications
      name: 'SearchComment',
      component: () => import('@/views/list/search-table/index.vue'),
      meta: {
        locale: 'menu.list.searchComment',
        requiresAuth: true,
        roles: ['*'],
      },
    },
  ],
};

export default LIST;
