import axios from 'axios';
import type { FeatureCollection } from '@/types/geo';
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

export interface MapQueryModel {
  code: number;
  isFull?: boolean;
}

export async function getMapJsonWithCode(code = 100000, isFull = true) {
  const name = `${code}${isFull ? '_full' : ''}`;
  const json = (await axios.get(
    `https://geo.datav.aliyun.com/areas_v3/bound/${name}.json`
  )) as any;

  return {
    data: json as FeatureCollection,
  };

  return axios.get<FeatureCollection>('https://itravel.todayto.com/map', {
    params: { code },
  });
}

export default {};
