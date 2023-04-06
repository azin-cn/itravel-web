<script lang="ts" setup>
  import { ref, onMounted } from 'vue';
  import { useRouter } from 'vue-router';
  import * as echarts from 'echarts';
  import { EChartsResizeOption } from 'echarts';
  import CN from '@/assets/map/china_without_south_sea.json';
  import type { FeatureCollection } from '@/types/geo';
  import { SpotModel, RegionModel, getSpotCount } from '@/api/spot';
  import useMap from './use-map';
  import useECharts from './use-echarts';
  import useSeries from './use-series';
  import IHeader from './components/IHeader.vue';
  import IFooter from './components/IFooter.vue';
  import HotTours from './components/hot-tours.vue';

  const router = useRouter();
  const { getNewMap } = useMap();
  const { optionsTooltip, optionsGeo, optionsVisualMap } = useECharts();
  const { genSeriesAndLegends, formatLegends } = useSeries();
  const headerRef = ref();
  const mapRef = ref();
  const geoJson = ref(CN as FeatureCollection);
  const query = ref<Partial<SpotModel>>({
    id: undefined,
    name: undefined,
    district: undefined,
    city: undefined,
    province: undefined,
    country: undefined,
    months: [],
    features: [],
  });
  const counter = ref(0);

  const init = async () => {
    const { series, legends } = await genSeriesAndLegends();
    const mapEl = echarts.init(mapRef.value);

    const options = {
      // 背景颜色
      // backgroundColor: 'rgb(121,145,100)',
      backgroundColor: '#404a59',
      // backgroundColor: '#4195a4',
      animation: true,
      animationDuration: 1000,
      animationDurationUpdate: 1000,
      // 提示浮窗样式
      tooltip: optionsTooltip,
      // geo 地图
      geo: optionsGeo,
      // 图例
      legend: legends,
      // 序列
      series,
      // 水印，文档：https://echarts.apache.org/zh/option.html#graphic.elements-group
      graphic: [
        {
          type: 'text', // group text
          left: 60, // 相对于容器的位置，可使用百分比2%
          top: 60,
          // 样式设置
          style: {
            text: '中国', // 文本内容
            font: 'normal 1rem "Microsoft YaHei", sans-serif', // 字体粗细、大小、字体
            fill: '#fff', // 字体颜色
          },
          onclick: async () => {
            options.graphic.splice(1); // 清除除China后续节点
            options.geo.zoom = 1;
            options.geo.map = 'china';
            options.series[0].data = (await getSpotCount()).data;
            options.visualMap[0].max = 2000;
            echarts.registerMap('china', CN);
            mapEl.setOption(options, true); // rerender
            geoJson.value = CN as FeatureCollection; // update
          },
        },
      ],
      // 视觉映射
      visualMap: optionsVisualMap,
    } as any; // ECharts的TS类型还有很多问题，大部分定义为object

    /**
     * 动态设置最大值
     * @param data
     */
    const setVisualMapMax = (data: RegionModel[]) => {
      let max = 0;
      options.series[0].data = data.map((item) => {
        console.log(max, item.value, item.name);
        max = Math.max(max, item.value);
        return item;
      });
      options.visualMap[0].max = max;
    };
    /**
     * 设置数据
     * @param data
     */
    const setSeriesData = (data: RegionModel[]) => {
      options.series[0].data = data;
    };
    /**
     * 记录设置
     * @param selected
     */
    const setLegendSelected = (selected: any) => {
      options.legend.forEach((item: any) => {
        item.selected = selected;
      });
      /**
       * 记录条件
       */
      const { months, features } = formatLegends(selected);
      query.value.months = months;
      query.value.features = features;
    };

    /**
     *
     * @param mapName mapName options.geo.map
     * @param options EChartOption
     * @param geoJSON FeatureCollection
     * @param notMerge boolean
     */
    const render = (
      mapName: string,
      customerOptions: any,
      geoJSON: FeatureCollection,
      notMerge = true
    ) => {
      // 第一个参数必须与 options.geo.map 一致
      echarts.registerMap(mapName, geoJSON);
      mapEl.setOption(customerOptions, notMerge);
    };
    render('china', options, CN as FeatureCollection);

    /**
     * function clear
     * 点击某一个 graphic 节点时，此 graphic 删除后续的节点
     */
    const clear = (area: string) => {
      const index = options.graphic.findIndex(
        (item: any) => item.style.text === area
      );
      options.graphic.splice(index + 1);
    };

    // mapEl.on('click', console.log);
    mapEl.off('click'); // 防止graph里频繁添加click事件，在添加click事件之前先全部清空掉
    mapEl.on('click', 'series', async (params: any) => {
      const { name, data: regionValue = {} } = params as {
        name: string;
        data: Partial<RegionModel>;
      };
      console.log('params', params);

      /**
       * 新的地图json
       */
      const json = await getNewMap(name, geoJson.value);

      if (Object.keys(json).length === 0) {
        console.log('click series, no json');
        // error message
        return;
      }

      /**
       * function update 应放在 options 更新后
       * 如 options.graphic.push 后执行，因为 echarts 通过 setOptions 进行更新，需要注意闭包
       * @param void
       * @return void
       */
      const update = async () => {
        // 先清理，后更新
        clear(name);
        // 更新 options.geo
        options.geo.zoom = 0.8;
        options.geo.map = name;
        // update and remember
        geoJson.value = json;
        console.log(regionValue);
        const { level = 'province', id } = regionValue;
        query.value[level] = id;
        console.log(query.value);

        counter.value += 1;
        const innerCount = counter.value;
        const { data } = await getSpotCount(query.value);
        if (innerCount === counter.value) {
          /**
           * 解决网络时延问题
           * 因为有await，利用闭包记录count和counter的关系
           */
          setSeriesData(data);
          setVisualMapMax(data);
        }

        // rerender, it has not animation, see https://github.com/apache/echarts/issues/14069
        render(name, options, json, true);
      };

      // 将onclick的操作记录到graphic中
      options.graphic.push({
        type: 'text',
        left: (options.graphic.length + 1) * 60, // 进行偏移，从1开始，所以需要加上1
        top: 60,
        style: {
          text: name, // 文本内容
          font: 'normal 1rem "Microsoft YaHei", sans-serif',
          fill: '#fff',
        },
        onclick: update, // 当点击指定的graphic时，恢复原有的map
      });

      update();
    });

    const legendselectchanged = async (params: any) => {
      const { selected } = params;
      setLegendSelected(selected);
      const { months, features } = formatLegends(selected);
      query.value.months = months;
      query.value.features = features;

      /**
       * 请求api重新渲染更新数据
       * legend选择变化时，visualMap的max值不进行更新
       */
      counter.value += 1;
      const count = counter.value;
      const { data } = await getSpotCount(query.value);
      if (count === counter.value) {
        /**
         * 因为有await，使用闭包记录count和counter的关系
         */
        setSeriesData(data);
      }
      mapEl.setOption(options, true);
    };

    // 监听图列点击，作为筛选条件发送给后台后获取新数据重新渲染
    mapEl.on('legendselectchanged', legendselectchanged);
    mapEl.on('legendselectall', legendselectchanged);
    mapEl.on('legendinverseselect', legendselectchanged);

    const autoResize = (): EChartsResizeOption => {
      const { height } = window.getComputedStyle(headerRef.value.$el);
      const { innerHeight, innerWidth } = window; // 当前作用域，不会沿着作用域链查找
      const h = innerHeight - parseFloat(height.slice(0, -2)) - 4;
      return {
        width: `${innerWidth - 17}px`,
        height: `${h}px`,
      };
    };

    mapEl.resize(autoResize());

    window.addEventListener('resize', () => {
      mapEl.resize(autoResize());
    });
  };

  const formatChars = (str: string, maxLen = 128) => {
    if (str.length > maxLen) {
      return `${str.substring(0, maxLen - 3)}...`;
    }
    return str;
  };

  const redirectArticle = (articleId: string) => {
    router.push({
      name: 'article',
      params: { articleId },
    });
  };

  onMounted(async () => {
    init();
  });
</script>

<template>
  <!--   -->
  <div style="max-width: 100vw">
    <IHeader ref="headerRef" style="background-color: rgb(141 170 185)" />
    <div id="echarts" ref="mapRef" style="width: 100%; border-radius: 20%" />
  </div>

  <div class="2xl:container mx-auto">
    <section>
      <h2 class="text-xl m-12"> 热门旅游景点 </h2>
      <!-- 主要景点 -->
      <HotTours></HotTours>
    </section>

    <section>
      <h2 class="text-xl m-12"> 更多旅游景点 </h2>
      <div class="flex justify-around">
        <div
          class="card w-1/4 bg-base-100 p-4 hover-card"
          style="height: 400px"
        >
          <img
            src="../../assets/images/A.jpg"
            class="shadow-xl h-1/2 rounded-lg"
            style="object-fit: cover"
            alt="Shoes"
          />
          <div class="card-body">
            <h2 class="card-title">Shoes!</h2>
            <p>If a dog chews shoes whose shoes does he choose?</p>
            <div class="card-actions justify-end">
              <button class="btn btn-primary">Watch</button>
            </div>
          </div>
        </div>
        <div
          class="card w-1/4 bg-base-100 p-4 hover-card"
          style="height: 400px"
        >
          <img
            src="../../assets/images/A.jpg"
            class="shadow-xl h-1/2 rounded-lg"
            style="object-fit: cover"
            alt="Shoes"
          />
          <div class="card-body">
            <h2 class="card-title">Shoes!</h2>
            <p>If a dog chews shoes whose shoes does he choose?</p>
            <div class="card-actions justify-end">
              <button class="btn btn-primary">Watch</button>
            </div>
          </div>
        </div>
        <div
          class="card w-1/4 bg-base-100 p-4 hover-card"
          style="height: 400px"
        >
          <img
            src="../../assets/images/A.jpg"
            class="shadow-xl h-1/2 rounded-lg"
            style="object-fit: cover"
            alt="Shoes"
          />
          <div class="card-body">
            <h2 class="card-title">Shoes!</h2>
            <p>If a dog chews shoes whose shoes does he choose?</p>
            <div class="card-actions justify-end">
              <button class="btn btn-primary">Watch</button>
            </div>
          </div>
        </div>
        <div
          class="card w-1/4 bg-base-100 p-4 hover-card"
          style="height: 400px"
        >
          <img
            src="../../assets/images/A.jpg"
            class="shadow-xl h-1/2 rounded-lg"
            style="object-fit: cover"
            alt="Shoes"
          />
          <div class="card-body">
            <h2 class="card-title">Shoes!</h2>
            <p>If a dog chews shoes whose shoes does he choose?</p>
            <div class="card-actions justify-end">
              <button class="btn btn-primary">Watch</button>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>

  <IFooter></IFooter>
</template>

<style scoped>
  /* less 结合 tailwind 会出现问题 */
  .card-title {
    min-width: 0;
    max-width: 200px;
  }

  .truncate {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  .hover-card,
  .hover-img {
    transition: all 0.2s;
  }

  .hover-card:hover {
    @apply w-1/2;
  }

  .hover-img:hover {
    transform: scale(1.14);
  }
</style>
