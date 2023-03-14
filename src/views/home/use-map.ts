import { FeatureCollection } from '@/types/geo';
import { getMapJsonWithCode } from '@/api/map';
import { Message } from '@arco-design/web-vue';
/**
 *
 * @param {String} name 当前点击的区域名称
 * @param {FeatureCollection} record 当前 FeatureCollection 数据
 */
export async function getNewMapByAMap(
  name: string,
  record: FeatureCollection
): Promise<FeatureCollection> {
  const area = record.features.find((item) => item.properties.name === name);
  // Can't be directly deconstructed
  console.log('new area is', area?.properties.name);
  if (area) {
    const { adcode, level } = area.properties;

    if (level === 'district') {
      Message.info('已经是最小范围！');
      return {} as FeatureCollection;
    }

    try {
      // axios 已经捕获，此时可以不加trycatch
      const { data } = await getMapJsonWithCode(adcode);
      return data;
    } catch (error) {
      console.log('request error');
    }
  }

  // 点击地图，肯定能找到对应的区域名称，如果是由点击区域外的触发，做相应的处理
  // Message.info('没有更多数据！');
  return {} as FeatureCollection;
}

export default function useMap() {
  /**
   *
   * @param { String } name 当前点击的区域名称
   * @param { FeatureCollection } record 当前 FeatureCollection 数据
   * @param { 'amap' | 'tmap' | 'bmap' } type 地图提供商
   */
  const getNewMap = async (
    name: string,
    record: FeatureCollection,
    type: 'amap' | 'tmap' | 'bmap' = 'amap'
  ): Promise<FeatureCollection> => {
    switch (type) {
      case 'amap': {
        // 作用域问题
        const res = await getNewMapByAMap(name, record);
        return res;
      }
      default:
        break;
    }
    return {} as FeatureCollection;
  };

  return {
    getNewMap,
  };
}
