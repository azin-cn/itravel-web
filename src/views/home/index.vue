<script lang="ts" setup>
  import { ref, onMounted } from 'vue';
  import * as echarts from 'echarts';
  import { EChartsResizeOption } from 'echarts';
  import CN from '@/assets/map/china_without_south_sea.json';
  import { getSeriesData } from '@/api/map';
  import type { FeatureCollection } from '@/types/geo';
  import useMap from './use-map';
  import useECharts from './use-echarts';
  import useSeries from './use-series';
  import IHeader from './components/IHeader.vue';
  import IFooter from './components/IFooter.vue';

  const { getNewMap } = useMap();
  const { optionsTooltip, optionsGeo, optionsVisualMap } = useECharts();
  const { genSeriesAndLegends } = useSeries();
  const headerRef = ref();
  const mapRef = ref();
  const geoJson = ref(CN as FeatureCollection);

  const init = async () => {
    const mapEl = echarts.init(mapRef.value);
    const { series, legends } = await genSeriesAndLegends();

    const options = {
      // 背景颜色
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
          onclick: () => {
            options.graphic.splice(1); // 清除除China后续节点
            options.geo.zoom = 1;
            options.geo.map = 'china';
            echarts.registerMap('china', CN);
            mapEl.setOption(options, true); // rerender
            geoJson.value = CN as FeatureCollection; // update
          },
        },
      ],
      // 视觉映射
      visualMap: optionsVisualMap,
    } as any; // ECharts的TS类型还有很多问题，大部分定义为object

    const setSeriesData = (data: any) => {
      options.series[0].data = data;
    };
    const setLegendSelected = (selected: any) => {
      options.legend.forEach((item: any) => {
        item.selected = selected;
      });
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
      const { name } = params;
      // new map json
      const json = await getNewMap(name, geoJson.value);

      if (Object.keys(json).length === 0) {
        console.log('click series, no json');
        // error message
        return;
      }

      /**
       * function update 应放在 options 更新后 如 options.graphic.push 后执行，因为 echarts 通过 setOptions 进行更新，需要注意闭包
       * @param void
       * @return void
       */
      const update = () => {
        // 先清理，后更新
        clear(name);
        // 更新 options.geo
        options.geo.zoom = 0.8;
        options.geo.map = name;
        // update and remember
        geoJson.value = json;
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

      // 请求api重新渲染更新数据
      const { data } = await getSeriesData();
      setSeriesData(data);
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
        width: innerWidth,
        height: h,
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

  onMounted(async () => {
    init();
  });
</script>

<template>
  <!--   -->
  <div style="width: 100vw">
    <IHeader ref="headerRef" style="background-color: rgb(141 170 185)" />
    <div id="echarts" ref="mapRef" style="border-radius: 20%" />
  </div>

  <div class="2xl:container mx-auto">
    <section>
      <h2 class="text-xl m-12"> 热门旅游景点</h2>
      <!-- 主要景点 -->
      <div class="hero min-h-0 p-12 pt-6">
        <div class="hero-content flex-col lg:flex-row-reverse">
          <img
            src="../../assets/images/C.jpg"
            class="max-w-lg rounded-lg shadow-2xl hover-img"
            width="448"
            height="290"
            style="display: block; width: 50%; height: 290px; object-fit: cover"
          />
          <div>
            <h2 class="text-4xl font-bold"> 西藏布达拉宫 </h2>
            <p class="py-6" style="text-indent: 2em">
              布达拉宫的主体建筑群坐落在海拔3700多米的玛布日山上，建于公元7世纪，历经唐、宋、元、明、清等多个朝代的修建和扩建，是世界上现存规模最大、最完整的古代宫殿建筑之一，被誉为“世界屋脊”的象征。
              布达拉宫的主体建筑群坐落在海拔3700多米的玛布日山上，建于公元7世纪，历经唐、宋、元、明、清等多个朝代的修建和扩建，是世界上现存规模最大、最完整的古代宫殿建筑之一，被誉为“世界屋脊”的象征。
            </p>
            <button class="btn btn-primary">Get Started</button>
          </div>
        </div>
      </div>

      <!-- 次要的两个景点 -->
      <div
        class="flex justify-around p-12 max-w-screen-xl mx-auto"
        style="height: 340px"
      >
        <!-- 一 -->
        <div class="card md:card-side bg-base-100 p-2" style="width: 54%">
          <img
            src="../../assets/images/B.jpg"
            class="rounded-lg shadow-xl hover-img"
            alt="Movie"
            style="width: 52%"
            loading="lazy"
          />
          <div class="card-body">
            <h2 class="card-title">
              <div class="truncate"> 珠峰 </div>
            </h2>
            <p style="max-height: 110px; text-indent: 2rem">
              {{
                formatChars(
                  '珠穆朗玛峰，高度8844.43米，为海拔世界第一高峰。穆朗玛峰，简称峰，高度8844.43米，为海拔世界第一高峰。'
                )
              }}
            </p>
            <div class="card-actions justify-end">
              <button class="btn btn-primary">Watch</button>
            </div>
          </div>
        </div>
        <!-- 二 -->
        <div class="card md:card-side bg-base-100 p-2" style="width: 44%">
          <img
            src="../../assets/images/A.jpg"
            class="rounded-lg shadow-xl hover-img"
            style="width: 48%"
            alt="Movie"
          />
          <div class="card-body">
            <h2 class="card-title">
              <div class="truncate"> 俯瞰纳木错 </div>
            </h2>
            <p style="max-height: 110px; text-indent: 2rem">
              “纳木错”为藏语，蒙古语名称为“腾格里海”，都是“天湖”之意。纳木错是西藏的“三大圣湖”之一，也是古象雄雍仲苯教的第一神湖。
            </p>
            <div class="card-actions justify-end">
              <button class="btn btn-primary">Watch</button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section>
      <h2 class="text-xl m-12"> 更多旅游景点 </h2>
      <div class="flex justify-around">
        <div
          class="card w-1/4 bg-base-100 p-4 hover-card"
          style="height: 380px"
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
          style="height: 380px"
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
          style="height: 380px"
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
          style="height: 380px"
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
    transform: scale(1.2);
  }

  .overflow-ellipsis {
  }
</style>
