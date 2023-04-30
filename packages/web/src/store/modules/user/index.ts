import { defineStore } from 'pinia';
import {
  login as userLogin,
  logout as userLogout,
  register as userRegister,
  getUserInfo,
  AuthData,
} from '@/api/user';
import {
  setToken,
  clearToken,
  setUserID,
  getUserID,
  clearUserID,
} from '@/utils/auth';
import { removeRouteListener } from '@/utils/route-listener';
import { UserState } from './types';

const useUserStore = defineStore('user', {
  state: (): UserState => ({
    id: undefined,
    name: undefined,
    avatar: undefined,
    job: undefined,
    organization: undefined,
    location: undefined,
    email: undefined,
    introduction: undefined,
    personalWebsite: undefined,
    jobName: undefined,
    organizationName: undefined,
    locationName: undefined,
    phone: undefined,
    registrationDate: undefined,
    accountId: undefined,
    certification: undefined,
    role: '',
  }),

  getters: {
    userInfo(state: UserState): UserState {
      return { ...state };
    },
  },

  actions: {
    switchRoles() {
      return new Promise((resolve) => {
        this.role = this.role === 'user' ? 'admin' : 'user';
        resolve(this.role);
      });
    },
    // Set user's information
    setInfo(partial: Partial<UserState>) {
      this.$patch(partial);
    },

    // Reset user's information
    resetInfo() {
      this.$reset();
    },

    // Get user's information
    async info() {
      const id = getUserID();
      const res = await getUserInfo(id as string);
      this.setInfo(res.data);
    },

    /**
     * 注册
     */
    async register(form: AuthData) {
      try {
        const res = await userRegister(form);
        return res;
      } catch (err) {
        clearToken();
        clearUserID();
        throw err;
      }
    },

    // Login
    async login(loginForm: AuthData) {
      try {
        const { data } = await userLogin(loginForm);
        setToken(data.token);
        setUserID(data.user.id as string);
      } catch (err) {
        clearToken();
        clearUserID();
        throw err;
      }
    },

    /**
     * 第三方登录
     */
    async loginWithThird() {
      //
    },

    logoutCallBack() {
      this.resetInfo();
      clearToken();
      clearUserID();
      removeRouteListener();
    },

    // Logout
    async logout() {
      try {
        await userLogout();
      } finally {
        this.logoutCallBack();
      }
    },
  },
});

export default useUserStore;
