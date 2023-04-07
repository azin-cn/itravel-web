import axios from 'axios';
import type { FeatureCollection } from '@/types/geo';
import type { ListResult } from '@/types/global';
import type { HttpResponse } from '@/types/request';

/**
 *
 * @param {any} params
 * @param {'amap' | 'bmap' | 'self'} from
 * @returns {JSON} Request Map Json
 */
export function getMapJson(
  params = {},
  from: 'amap' | 'bmap' | 'self' = 'self'
) {}

export interface MapQueryRecord {
  code: number;
  isFull?: boolean;
}

export async function getMapJsonWithCode(code = 100000, isFull = true) {
  // const name = `${code}${isFull ? '_full' : ''}`;
  // const json = (await axios.get(
  //   `https://geo.datav.aliyun.com/areas_v3/bound/${name}.json`
  // )) as any;

  // return {
  //   data: json as FeatureCollection,
  // };

  return axios.get<FeatureCollection>('https://itravel.todayto.com/map', {
    params: { code },
  });
}

export interface ISeriesDataRecord {
  name: string;
  value: number;
  Jan: number;
  Feb: number;
  Mar: number;
  Apr: number;
  May: number;
  Jun: number;
  Jul: number;
  Aug: number;
  Sep: number;
  Oct: number;
  Nov: number;
  Dec: number;
  mountain: number;
  water: number;
  forest: number;
  grass: number;
  sand: number;
  soil: number;
  humanity: number;
  modern: number;
}

export async function getSeriesData() {
  return axios.get<ISeriesDataRecord[]>('/api/series');
}

export default {};
