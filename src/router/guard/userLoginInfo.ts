import type { Router, LocationQueryRaw } from 'vue-router';
import NProgress from 'nprogress'; // progress bar

import { useUserStore } from '@/store';
import { isLogin } from '@/utils/auth';
import { LocationQuery } from 'vue-router';

export default function setupUserLoginInfoGuard(router: Router) {
  router.beforeEach(async (to, from, next) => {
    NProgress.start();
    const userStore = useUserStore();
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
    } else {
      console.log(from, to);
      if (to.name === 'login') {
        to.query = {
          redirect: from.name,
          ...to.query,
        } as LocationQuery;
        next();
      }

      next();
      /**
       * 无需登录
       */
      // next({
      //   name: 'login',
      //   query: {
      //     redirect: to.name,
      //     ...to.query,
      //   } as LocationQueryRaw,
      // });
    }
  });
}
