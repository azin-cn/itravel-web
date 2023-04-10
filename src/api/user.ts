import axios from 'axios';
import { cloneDeep } from 'lodash';
import type { RouteRecordNormalized } from 'vue-router';
import { UserState } from '@/store/modules/user/types';
import { prefix } from './base';

export const AUTH_TYPE = {
  ACCOUNT: 1,
  MOBILE: 2,
  THIRD: 3,
};

export interface AuthData {
  account: string;
  username: string;
  email: string;
  password: string;
  phone: string;
  captcha: string;
  type: number;
}

/**
 * 使用邮件注册
 * @param data
 * @returns
 */
export function registerWithEmail(data: Partial<AuthData>) {
  data = cloneDeep(data);
  const { type } = data;
  delete data.type;
  delete data.phone;
  delete data.captcha;
  delete data.account;
  return axios.post(`${prefix}/auth/register`, data, { params: { type } });
}

/**
 * @param data
 */
export function register(data: Partial<AuthData>) {
  return registerWithEmail(data);
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
  data = cloneDeep(data);
  const { type } = data;
  delete data.type;

  if (type === AUTH_TYPE.ACCOUNT) {
    /**
     * 账户登录
     */
    delete data.phone;
    delete data.captcha;
  } else if (type === AUTH_TYPE.MOBILE) {
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

/**
 * 获取随机的用户
 * @returns
 */
export function getRandUsers() {
  return axios.get<UserState[]>(`${prefix}/user/recom_user/rand`);
}
