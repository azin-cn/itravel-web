import axios from 'axios';
import type { TableData } from '@arco-design/web-vue/es/table/interface';

export interface WorkplacePanelCount {
  /**
   * 景点数量
   */
  spotCount: number;
  /**
   * 文章数量
   */
  articleCount: number;
  /**
   * 评论总数量
   */
  commentCount: number;
  /**
   * 日新增数量
   */
  todayCommentCount: number;
  /**
   * 昨日新增数量
   */
  yesterdayCommentCount: number;
}

export interface WorkplaceModel {
  banner: WorkplacePanelCount;
}

export interface ContentDataRecord {
  x: string;
  y: number;
}

export function queryContentData() {
  return axios.get<ContentDataRecord[]>('/api/content-data');
}

export interface PopularRecord {
  key: number;
  clickNumber: string;
  title: string;
  increases: number;
}

export function queryPopularList(params: { type: string }) {
  return axios.get<TableData[]>('/api/popular/list', { params });
}
