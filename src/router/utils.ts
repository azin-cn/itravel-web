import type { RouteParamsRaw } from 'vue-router';
import router from './index';

export function getRouteQueries() {
  const { redirect, ...othersQuery } = router.currentRoute.value.query;
  return { redirect, othersQuery };
}

export function redirectHome() {
  const { othersQuery } = getRouteQueries();

  router.push({
    name: 'home',
    query: othersQuery,
  });
}

export function redirectHomeOrDefault() {
  const { redirect, othersQuery } = getRouteQueries();
  console.log('redirect', redirect);
  router.push({
    name: (redirect as string) || 'home',
    query: {
      ...othersQuery,
    },
  });
}

/**
 * redirectRegister 注册
 */
export function redirectRegister() {
  const { othersQuery } = getRouteQueries();
  router.push({
    name: 'register',
    query: othersQuery,
  });
}

/**
 * redirectRegister 注册页或默认
 */
export function redirectRegisterOrDefault() {
  const { redirect, othersQuery } = getRouteQueries();
  router.push({
    name: (redirect as string) || 'register',
    query: othersQuery,
  });
}

/**
 * replaceLogin
 */
export function replaceLogin() {
  const { othersQuery } = getRouteQueries();
  router.replace({
    name: 'login',
    query: othersQuery,
  });
}

/**
 * replaceLoginOrDefault
 */
export function replaceLoginOrDefault() {
  const { redirect, othersQuery } = getRouteQueries();
  router.replace({
    name: (redirect as string) || 'login',
    query: othersQuery,
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
  redirectRegister,
  redirectRegisterOrDefault,
  replaceLogin,
  replaceLoginOrDefault,
};
