import type { Router, LocationQueryRaw } from 'vue-router';
import NProgress from 'nprogress'; // progress bar

import { useUserStore } from '@/store';
import { isLogin } from '@/utils/auth';
import { LocationQuery } from 'vue-router';

export default function setupUserLoginInfoGuard(router: Router) {
  router.beforeEach(async (to, from, next) => {
    NProgress.start();
    const userStore = useUserStore();
    /**
     * 特殊跳转配置
     * 因为多次跳转会丢失路由信息，需要通过redirectedFrom记录
     */
    if (
      ['article', 'spot', 'userPreview', 'userProfile'].includes(
        from?.name as string
      ) &&
      to.name === 'login'
    ) {
      to.redirectedFrom = from;
    }

    if (isLogin()) {
      if (userStore.role) {
        next();
      } else {
        try {
          await userStore.info();
          next();
        } catch (error) {
          await userStore.logout();
          next({
            name: 'login',
            query: {
              redirect: to.name,
              ...to.query,
            } as LocationQueryRaw,
          });
        }
      }
    } else if (to.name === 'login') {
      const isRegister = from.name === 'register';
      to.query = {
        redirect: isRegister ? 'home' : from.name,
        ...to.query,
      } as LocationQuery;
      next();
    } else {
      const { requiresAuth } = to.meta;
      if (requiresAuth) next({ name: 'login' });
      else next();
    }
  });
}
