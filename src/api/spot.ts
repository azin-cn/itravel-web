import axios from 'axios';
import qs from 'qs';

export const baseURL = 'http://localhost:7000';

/**
 * 景点基础数据类型
 */
export interface BaseModel {
  id: string;
  name: string;
}

/**
 * 完整景点数据类型
 */
export interface SpotModel extends BaseModel {
  description: string;
  country: string;
  province: string;
  city: string;
  district: string;
  months: string[];
  features: string[];
}

export type PartialSpotModel = Partial<SpotModel>;

/**
 * 景点数量数据类型
 */
export interface RegionModel extends BaseModel {
  fullName: string;
  level: 'country' | 'province' | 'city' | 'district';
  value: number;
}

/**
 * 获取景点数据
 * @param params
 * @returns
 */
export function getSpotCount(params: Partial<SpotModel> = {}) {
  params = Object.keys(params).reduce((target, key: string) => {
    const k = key as keyof SpotModel;
    const value = params[k];
    if (value instanceof Array) {
      target[k] = value.join();
    } else {
      target[k] = value;
    }
    return target;
  }, {} as any);

  return axios.get<RegionModel[]>(`${baseURL}/spot/area_counts`, {
    params,
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

/**
 * 排行旅游景点类型
 */
export interface ITour {
  id: string;
  name: string;
  description: string;
  thumbUrl: string;
  level: string; // 区域等级
  region: string;
  regionId: string;
  weight: number;
  createdTime?: string;
  updatedTime?: string;
}

/**
 * 获取热门的景点信息
 * @param params
 * @returns
 */
export function getHotSpots(params: PartialSpotModel = {}) {
  return axios.get<ITour[]>(`${baseURL}/spot/area_spots`, { params });
}

/**
 * 获取更多的景点
 * @param params
 * @returns
 */
export function getRandSpots(params: PartialSpotModel = {}) {
  return axios.get<ITour[]>(`${baseURL}/spot/recom_spots/rand`, { params });
}
