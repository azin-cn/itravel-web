import axios from 'axios';
import qs from 'query-string';
import type { DescData } from '@arco-design/web-vue/es/descriptions/interface';
import { ListResult } from '@/types/global';
import { BaseModel, prefix } from './base';

export interface PolicyRecord {
  id: string;
  number: number;
  name: string;
  contentType: 'img' | 'horizontalVideo' | 'verticalVideo';
  filterType: 'artificial' | 'rules';
  count: number;
  status: 'online' | 'offline';
  createdTime: string;
}

export interface PolicyParams extends Partial<PolicyRecord> {
  current: number;
  pageSize: number;
}

export interface PolicyListRes {
  list: PolicyRecord[];
  total: number;
}

export function queryPolicyList(params: PolicyParams) {
  return axios.get<PolicyListRes>('/api/list/policy', {
    params,
    paramsSerializer: (obj) => {
      return qs.stringify(obj);
    },
  });
}

export interface ServiceRecord {
  id: number;
  title: string;
  description: string;
  name?: string;
  actionType?: string;
  icon?: string;
  data?: DescData[];
  enable?: boolean;
  expires?: boolean;
}
export function queryInspectionList() {
  return axios.get('/api/list/quality-inspection');
}

export function queryTheServiceList() {
  return axios.get('/api/list/the-service');
}

export function queryRulesPresetList() {
  return axios.get('/api/list/rules-preset');
}

export interface ISpotQueryParams {
  id: string;
  name: string;
  region: string;
  create_date_before: string;
  create_date_after: string;
}

export interface RegionModel {
  id: string;
  name: string;
  fullName: string;
  weight: number;
  aid: string;
  bid: string;
  tid: string;
}

export interface AdminSpotModel {
  id: string;
  name: string;
  description: string;
  thumbUrl: string;
  panorama: string;
  weight: number;
  months: BaseModel[];
  features: BaseModel[];
  country: RegionModel;
  province: RegionModel;
  city: RegionModel;
  district: RegionModel;
  createdTime: string;
  updatedTime: string;
}

export function getSpotsByConditions(params: ISpotQueryParams) {
  return axios.get<ListResult<AdminSpotModel>>(`${prefix}/admin/spot/query`, {
    params,
  });
}
