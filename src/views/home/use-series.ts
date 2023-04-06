import { ref } from 'vue';
import type { Ref } from 'vue';
import {
  RegionModel,
  getMonths,
  getSpecials,
  getSpotCount,
  MonthModel,
  SpecialModel,
  SpotModel,
} from '@/api/spot';

export interface NameMapItem {
  id: string;
  alias: string;
  name: string;
}
export type NameMap = Array<Partial<NameMapItem>>;

export default function useSeries() {
  // const legends = [
  //   'Jan',
  //   'Feb',
  //   'Mar',
  //   'Apr',
  //   'May',
  //   'Jun',
  //   'Jul',
  //   'Aug',
  //   'Sep',
  //   'Oct',
  //   'Nov',
  //   'Dec',
  // ];

  const monthNames: Ref<NameMap> = ref([
    { alias: 'Jan', name: '一月' },
    { alias: 'Feb', name: '二月' },
    { alias: 'Mar', name: '三月' },
    { alias: 'Apr', name: '四月' },
    { alias: 'May', name: '五月' },
    { alias: 'Jun', name: '六月' },
    { alias: 'Jul', name: '七月' },
    { alias: 'Aug', name: '八月' },
    { alias: 'Sep', name: '九月' },
    { alias: 'Oct', name: '十月' },
    { alias: 'Nov', name: '十一月' },
    { alias: 'Dec', name: '十二月' },
  ]);

  const specialNames: Ref<NameMap> = ref([
    { alias: 'mountain', name: '山' },
    { alias: 'water', name: '水' },
    { alias: 'forest', name: '林' },
    { alias: 'grass', name: '草' },
    { alias: 'sand', name: '沙' },
    { alias: 'soil', name: '土' },
    { alias: 'humanity', name: '人文' },
    { alias: 'modern', name: '现代' },
  ]);

  const mainSerie = {
    name: 'china',
    type: 'map',
    geoIndex: 0, // geo
    smooth: true,
    animation: true,
    data: [],
  };

  const remoteMonthMap = new Map<string, MonthModel>();
  const remoteSpecialMap = new Map<string, SpecialModel>();

  const genSeriesAndLegends = async (type = 'zh') => {
    const [remoteMonthsRes, remoteSpecialsRes] = await Promise.all([
      getMonths(),
      getSpecials(),
    ]);

    remoteMonthsRes.data.forEach((item) => {
      const { name = '' } = item;
      remoteMonthMap.set(name, item);
    });
    remoteSpecialsRes.data.forEach((item) => {
      const { name = '' } = item;
      remoteSpecialMap.set(name, item);
    });

    const months = monthNames.value.map((item) => item.name);
    const specials = specialNames.value.map((item) => item.name);

    // 生成对应的series以展示legend
    const series = [...months, ...specials].map((name) => ({
      name,
      type: 'map',
      geoIndex: 0, // geo
      data: [] as RegionModel[],
    }));
    series.unshift(mainSerie); // seriesIndex[0]

    const legends = [
      {
        orient: 'vertical',
        right: 60,
        top: 30,
        z: -1,
        align: 'right',
        textStyle: {
          color: '#fff',
        },
        selector: true, // 选择器，全选和反选
        data: months,
      },
      {
        orient: 'vertical',
        right: 63,
        top: 380,
        z: -1,
        align: 'right',
        textStyle: {
          color: '#fff',
        },
        data: specials,
      },
    ];

    /**
     * 初始的数据
     */
    const { data } = await getSpotCount();

    series[0].data = data; // main Series data

    return {
      series,
      legends,
    };
  };

  const formatLegends = (selected: Record<string, boolean>) => {
    console.log(selected);
    const params = Object.keys(selected).reduce(
      (target, name: string) => {
        /**
         * 未选中
         */
        if (!selected[name]) return target;

        /**
         * 分组
         */
        if (remoteMonthMap.has(name))
          target.months.push(remoteMonthMap.get(name)?.id as string);
        else target.months.push(remoteSpecialMap.get(name)?.id as string);

        return target;
      },
      { months: [], features: [] } as { months: string[]; features: string[] }
      // Pick<SpotModel, 'months'> & Pick<SpotModel, 'features'>
    );

    console.log(params.months, params.features);
    return params;
  };

  return { genSeriesAndLegends, formatLegends };
}
