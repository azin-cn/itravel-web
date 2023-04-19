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

export function redirectHomeWithoutQuery() {
  router.push({ name: 'home' });
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
 * 重定向到spot景点
 * @param spotId
 */
export const redirectSpot = async (spotId: string) => {
  router.push({
    name: 'spot',
    params: { spotId },
  });
};

/**
 * 重定向redirectUserPreview
 * @param userId
 */
export const redirectUserPreview = (userId: string) => {
  router.push({
    name: 'userPreview',
    params: { userId },
  });
};

/**
 * 重定向到userProfile
 * @param userId
 */
export const redirectUserProfile = (userId: string) => {
  /**
   * TODO: 鉴别是否登录
   */
  router.push({
    name: 'userProfile',
    params: { userId },
  });
};

/**
 * 跳转编辑页
 * @param articleId
 */
export const redirectEditor = (articleId?: string) => {
  router.push({
    name: 'editor',
    params: { articleId },
  });
};

/**
 * 跳转搜索页
 * @param s
 */
export const redirectSearch = (s: string) => {
  router.push({
    name: 'search',
    query: {
      s,
    },
  });
};

export default {
  redirectHome,
  redirectHomeOrDefault,
  redirectLogin,
  redirectLoginOrDefault,
  redirectArticle,
  redirectRegister,
  redirectRegisterOrDefault,
  replaceLogin,
  replaceLoginOrDefault,
  redirectUserPreview,
};
