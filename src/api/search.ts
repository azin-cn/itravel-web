import axios from 'axios';
import { ListResult } from '@/types/global';
import { UserState } from '@/store/modules/user/types';
import { IPaginationOpton, prefix } from './base';
import { ArticleBriefInfo } from './article';
import { ITour, SpotBreifInfoModel } from './spot';

/**
 * 根据关键词搜索用户
 * @param s
 * @param options
 * @returns
 */
export function getUsersByKeywords(s: string, options: IPaginationOpton) {
  return axios.get<ListResult<UserState>>(`${prefix}/search/user`, {
    params: { s, ...options },
  });
}

/**
 * 根据关键词搜索景点
 * @param s
 * @param options
 * @returns
 */
export function getSpotsByKeywords(s: string, options: IPaginationOpton) {
  return axios.get<ListResult<ITour>>(`${prefix}/search/spot`, {
    params: { s, ...options },
  });
}

/**
 * 根据关键词搜索文章
 * @param s
 * @param options
 * @returns
 */
export function getArticlesByKeywords(s: string, options: IPaginationOpton) {
  return axios.get<ListResult<ArticleBriefInfo>>(`${prefix}/search/article`, {
    params: { s, ...options },
  });
}
