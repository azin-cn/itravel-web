import axios from 'axios';
import qs from 'query-string';

export const baseURL = 'http://localhost:7000';

/**
 * 景点基础数据类型
 */
export interface SpotBaseModel {
  id: string;
  name: string;
  fullName: string;
}

/**
 * 完整景点数据类型
 */
export interface SpotModel extends SpotBaseModel {
  description: string;
  country: string;
  province: string;
  city: string;
  district: string;
  months: string[];
  features: string[];
}

/**
 * 景点数量数据类型
 */
export interface RegionModel extends SpotBaseModel {
  level: 'country' | 'province' | 'city' | 'district';
  value: number;
}

/**
 * 获取景点数据
 * @param params
 * @returns
 */
export function getSpotCount(params: Partial<SpotModel> = {}) {
  return axios.get<RegionModel[]>(`${baseURL}/spot/area_counts`, {
    params,
    paramsSerializer: (ps) => {
      return qs.stringify(ps, { arrayFormat: 'bracket-separator' });
    },
  });
}

/**
 * 月份/特色信息数据类型
 */
export interface MonthORFeatureBaseModel {
  id: string;
  name: string;
  createdTime: string;
  updatedTime: string;
}
export type MonthModel = Partial<MonthORFeatureBaseModel>;
export type SpecialModel = Partial<MonthORFeatureBaseModel>;

/**
 * 月份数组
 * @returns
 */
export function getMonths() {
  return axios.get<MonthModel[]>(`${baseURL}/month`);
}
/**
 * 特色数组
 * @returns
 */
export function getSpecials() {
  return axios.get<SpecialModel[]>(`${baseURL}/feature`);
}
