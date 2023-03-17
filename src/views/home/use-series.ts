import { ISeriesDataRecord, getSeriesData } from '@/api/map';

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

  const monthsNameMap = [
    ['Jan', '一月'],
    ['Feb', '二月'],
    ['Mar', '三月'],
    ['Apr', '四月'],
    ['May', '五月'],
    ['Jun', '六月'],
    ['Jul', '七月'],
    ['Aug', '八月'],
    ['Sep', '九月'],
    ['Oct', '十月'],
    ['Nov', '十一月'],
    ['Dec', '十二月'],
  ];

  const specialNameMap = [
    ['mountain', '山'],
    ['water', '水'],
    ['forest', '林'],
    ['grass', '草'],
    ['sand', '沙'],
    ['soil', '土'],
    ['humanity', '人文'],
    ['modern', '现代'],
  ];

  const mainSerie = {
    name: 'china',
    type: 'map',
    geoIndex: 0, // geo
    smooth: true,
    animation: true,
    data: [],
  };

  const genSeriesAndLegends = async (type = 'zh') => {
    const months = monthsNameMap.map((item) => item[0]);
    const specials = specialNameMap.map((item) => item[1]);
    // 生成对应的series以展示legend
    const series = [...months, ...specials].map((name) => ({
      name,
      type: 'map',
      geoIndex: 0, // geo
      data: [] as ISeriesDataRecord[],
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

    const { data } = await getSeriesData();

    series[0].data = data; // main Series data

    return {
      series,
      legends,
    };
  };

  return { genSeriesAndLegends };
}
