import type { RouteParamsRaw } from 'vue-router';
import router from './index';

export function getRouteQueries() {
  const { redirect, ...othersQuery } = router.currentRoute.value.query;
  return { redirect, othersQuery };
}

export function redirectHome() {
  const { othersQuery } = getRouteQueries();

  router.push({
    name: 'filelist',
    query: othersQuery,
  });
}

export function redirectHomeOrDefault() {
  const { redirect, othersQuery } = getRouteQueries();
  router.push({
    name: (redirect as string) || 'filelist',
    query: {
      ...othersQuery,
    },
  });
}

export function redirectLogin() {
  const { othersQuery } = getRouteQueries();
  router.push({
    name: 'login',
    query: othersQuery,
  });
}

export function redirectLoginOrDefault() {
  const { redirect, othersQuery } = getRouteQueries();
  router.push({
    name: (redirect as string) || 'login',
    query: othersQuery,
  });
}

/**
 * 重定向到article
 * @param articleId
 */
export const redirectArticle = async (articleId: string) => {
  router.push({
    name: 'article',
    params: { articleId },
  });
};

/**
 * 重定向userinfo
 * @param userId
 */
export const redirectUserInfo = (userId: string) => {
  router.push({
    name: 'userinfo',
    params: { userId },
  });
};

export default {
  redirectHome,
  redirectHomeOrDefault,
  redirectLogin,
  redirectLoginOrDefault,
  redirectUserInfo,
  redirectArticle,
};
