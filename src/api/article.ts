import axios from 'axios';
import { ListResult } from '@/types/global';
import { UserState } from '@/store/modules/user/types';
import { prefix, BaseModel } from './base';

interface Spot {
  id: string;
  name: string;
  thumbUrl: string;
  description: string;
}

type Author = UserState;

export interface ArticleBriefInfo {
  id: string;
  title: string;
  thumbUrl: string;
  summary: string;
  content: string;
  category: BaseModel;
  tags: BaseModel[];
  viewCount: number;
  likeCount: number;
  favCount: number;
  commentCount: number;
  status: number;
  publishTime: string;
  createdTime: string;
  updatedTime: string;
  spot: Partial<Spot>;
  author: Partial<Author>;
  images: string[];
}

export interface IPaginationOpton {
  limit: number;
  page: number;
}

/**
 * 获取文章的简略信息
 * @param id
 * @returns
 */
export function getSpotBriefInfoOfArticles(
  id: string,
  params: Partial<IPaginationOpton> = {}
) {
  return axios.get<ListResult<ArticleBriefInfo>>(
    `${prefix}/article/spot/${id}`,
    { params }
  );
}

/**
 * 获取随机的文章，十条
 * @returns
 */
export function getRandArticles() {
  return axios.get<ArticleBriefInfo[]>(`${prefix}/article/recom_article/rand`);
}

/**
 * 通过id获取文章
 * @param id
 * @returns
 */
export function getArticleById(id: string) {
  return axios.get<ArticleBriefInfo>(`${prefix}/article/${id}`);
}

/**
 * 获取用户的文章
 * @param userId
 * @returns
 */
export function getUserBriefArticles(userId: string) {
  return axios.get<ListResult<ArticleBriefInfo>>(
    `${prefix}/article/user/${userId}`
  );
}

/**
 * 获取分类
 * @param userId
 * @returns
 */
export function getCategoriesByNameAndUserId(s: string, id: string) {
  return axios.get<BaseModel[]>(`${prefix}/category/user`, {
    params: { id, s },
  });
}

/**
 * 获取标签
 * @param userId
 * @returns
 */
export function getTagsByNameAndUserId(s: string, id: string) {
  return axios.get<BaseModel[]>(`${prefix}/tags/user`, {
    params: { id, s },
  });
}
