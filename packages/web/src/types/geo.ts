import type {
  FeatureCollection as GFeatureCollection,
  Geometry,
} from 'geojson';

/**
 * Amap GeoJsonProperties
 */
export interface GeoJsonProperties {
  acroutes: number[];
  adcode: number;
  center: number[];
  centroid: number[];
  childrenNum: number;
  level: string; // 待完善, province ...
  name: string;
  parent: {
    adcode: number;
  };
  subFeatureIndex: number;
  adchar?: string; // 南海诸岛特殊配置
}

export type FeatureCollection = GFeatureCollection<Geometry, GeoJsonProperties>;
