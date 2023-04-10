import axios from 'axios';
import { ListResult } from '@/types/global';
import { prefix } from './base';

interface Spot {
  id: string;
  name: string;
  description: string;
}

interface Author {
  id: string;
  username: string;
  avatar: string;
  description: string | null;
}

export interface ArticleBriefInfo {
  id: string;
  title: string;
  thumbUrl: string;
  summary: string;
  content: string;
  viewCount: number;
  likeCount: number;
  favCount: number;
  status: number;
  publishTime: string;
  createdTime: string;
  updatedTime: string;
  spot: Spot;
  author: Author;
  commentCount: number;
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
