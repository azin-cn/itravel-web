import axios from 'axios';
import { IPaginationOpton, prefix } from './base';

/**
 * 根据关键词搜索用户
 * @param s
 * @param options
 * @returns
 */
export function getUsersByKeywords(s: string, options: IPaginationOpton) {
  return axios.get(`${prefix}/search/user`, { params: { s, ...options } });
}

export function getSpotsByKeywords(s: string, options: IPaginationOpton) {
  return axios.get(`${prefix}/search/spot`, { params: { s, ...options } });
}
