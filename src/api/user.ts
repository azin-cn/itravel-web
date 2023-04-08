import axios from 'axios';
import { useCloned } from '@vueuse/core';
import type { RouteRecordNormalized } from 'vue-router';
import { UserState } from '@/store/modules/user/types';
import { prefix } from './base';

export const LOGIN_TYPE = {
  ACCOUNT: 1,
  MOBILE: 2,
  THIRD: 3,
};

export interface AuthData {
  account: string;
  password: string;
  phone: string;
  captcha: string;
  type: number;
}

export interface LoginRes {
  token: string;
  user: Pick<UserState, 'id' | 'role' | 'avatar'>;
}

/**
 * 用户登录
 * @param data
 * @returns
 */
export function login(data: Partial<AuthData>) {
  data = useCloned(data).cloned.value;
  const { type } = data;
  delete data.type;

  if (type === LOGIN_TYPE.ACCOUNT) {
    /**
     * 账户登录
     */
    delete data.phone;
    delete data.captcha;
  } else if (type === LOGIN_TYPE.MOBILE) {
    /**
     * 验证码登录
     */
    delete data.account;
    delete data.password;
  }

  return axios.post<LoginRes>(`${prefix}/auth/login`, data, {
    params: { type },
  });
}

/**
 * 用户注销
 * @returns
 */
export function logout() {
  return axios.post<null>(`${prefix}/auth/logout`);
}

/**
 * 用户信息
 * @returns
 */
export function getUserInfo(id: string) {
  return axios.get<UserState>(`${prefix}/user/${id}`);
}
