import axios from 'axios';
import type { TableData } from '@arco-design/web-vue/es/table/interface';
import { prefix } from './base';

export interface WorkplacePanelCount {
  /**
   * 景点数量
   */
  spotCount: number;
  /**
   * 文章数量
   */
  articleCount: number;
  todayArticleCount: number;
  yesterdayArticleCount: number;
  /**
   * 评论数量
   */
  commentCount: number;
  todayCommentCount: number;
  yesterdayCommentCount: number;
}

export interface WorkplaceModel {
  counter: WorkplacePanelCount;
}

export interface ContentDataModel {
  x: string;
  y: number;
}

export function getWorkspaceCounter() {
  return axios.get<WorkplacePanelCount>(`${prefix}/admin/workspace/counter`);
}

export function queryContentData() {
  return axios.get<ContentDataModel[]>('/api/content-data');
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
