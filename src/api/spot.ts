import axios from 'axios';
import qs from 'qs';
import { prefix, BaseModel } from './base';

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

  return axios.get<RegionModel[]>(`${prefix}/spot/area_counts`, {
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
  return axios.get<MonthModel[]>(`${prefix}/month`);
}

/**
 * 特色数组
 * @returns
 */
export function getSpecials() {
  return axios.get<SpecialModel[]>(`${prefix}/feature`);
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
  return axios.get<ITour[]>(`${prefix}/spot/area_spots`, { params });
}

/**
 * 获取更多的景点
 * @param params
 * @returns
 */
export function getRandSpots(params: PartialSpotModel = {}) {
  return axios.get<ITour[]>(`${prefix}/spot/recom_spots/rand`, { params });
}

/**
 * 区域信息模型
 */
export interface RegionInfoModel {
  id: string;
  name: string;
  fullName: string;
  weight: number;
  aid?: string;
  bid?: string;
  tid?: string;
}

/**
 * 景点信息模型
 */
export interface SpotBreifInfoModel {
  id: string;
  name: string;
  description: string;
  thumbUrl: string;
  createdTime?: string;
  updatedTime?: string;
  province: RegionInfoModel;
  city: RegionInfoModel;
}

/**
 * 获取景点信息
 * @param id
 * @returns
 */
export function getSpotBriefInfo(id: string) {
  return axios.get<SpotBreifInfoModel>(`${prefix}/spot/${id}`);
}

/**
 * features and month
 */
export type FMInfoModel = Omit<SpotBreifInfoModel, 'province' | 'city'> & {
  months: MonthORFeatureBaseModel[];
  features: MonthORFeatureBaseModel[];
};

/**
 * 获取景点特色、月份
 */
export function getSpotMonthsAndFeatures(id: string) {
  return axios.get<FMInfoModel>(`${prefix}/spot/fm/${id}`);
}

/**
 * 根据关键字获取景点
 * @param s
 * @returns
 */
export function getSpotsByWords(s: string) {
  return axios.get<BaseModel[]>(`${prefix}/spot/search`, { params: { s } });
}

/**
 * 获取景点Model
 * @param ids
 * @returns
 */
export function getSpotsByIds(ids: string[]) {
  const params = { ids: ids?.join() };
  return axios.get<BaseModel[]>(`${prefix}/spot/ids`, { params });
}

/**
 * 得到全景图
 * @param id
 * @returns
 */
export function getSpotPanorama(id: string) {
  return {
    data: 'https://img.zcool.cn/community/01e6ae592fb49da8012193a3c3b31e.jpg@2o.jpg',
  };
  // return axios.get<string>(`${prefix}/spot/panorama/${id}`);
}
