<script lang="ts" setup>
  import { ref, onMounted } from 'vue';
  import * as echarts from 'echarts';
  import { EChartsResizeOption } from 'echarts';
  import type { FeatureCollection } from '@/types/geo';
  import CN from '@/assets/map/china_without_south_sea.json';
  import useMap from './use-map';
  import IHeader from './components/IHeader.vue';

  const { getNewMap } = useMap();
  const headerRef = ref();
  const mapRef = ref();
  const geoJson = ref(CN as FeatureCollection);

  const init = () => {
    const mapEl = echarts.init(mapRef.value);

    const normalStyle = {
      borderColor: 'rgba(147, 235, 248, 1)',
      borderWidth: 1,
      areaColor: {
        type: 'radial',
        x: 0.5,
        y: 0.5,
        r: 0.8,
        colorStops: [
          {
            offset: 0,
            color: 'rgba(147, 235, 248, 0)', // 0% 处的颜色
          },
          {
            offset: 1,
            color: 'rgba(147, 235, 248, .2)', // 100% 处的颜色
          },
        ],
        globalCoord: false, // 缺省为 false
      },
      shadowColor: 'rgba(128, 217, 248, 1)',
      shadowOffsetX: -2,
      shadowOffsetY: 2,
      shadowBlur: 10,
    };

    const options = {
      // 背景颜色
      backgroundColor: '#404a59',
      animation: true,
      animationDuration: 1000,
      animationDurationUpdate: 1000,
      // 提示浮窗样式
      tooltip: {
        show: true,
        trigger: 'item',
        alwaysShowContent: false,
        backgroundColor: '#0C121C',
        borderColor: 'rgba(0, 0, 0, 0.16);',
        hideDelay: 100,
        triggerOn: 'mousemove',
        enterable: true,
        textStyle: {
          color: '#DADADA',
          fontSize: 12,
          width: 20,
          height: 30,
          overflow: 'break',
        },
        showDelay: 30,
      },
      // 地图配置
      geo: {
        map: 'china',
        roam: 'move',
        left: '13%',
        top: 'center',
        // zoom: 1,
        scaleLimit: {
          min: 0.5,
          max: 20,
        },
        label: {
          // 文字通常状态下的样式
          normal: {
            show: true,
            textStyle: {
              color: '#fff',
            },
          },
          // 文字在鼠标放上去的样式
          emphasis: {
            textStyle: {
              color: '#fff',
            },
          },
        },
        // 地图区域的样式设置
        itemStyle: {
          // 正常状态下的显示
          normal: normalStyle,
          // 鼠标放上去高亮的样式
          emphasis: {
            areaColor: '#389BB7',
            borderWidth: 0,
          },
        },
        // 点击选中时的颜色
        select: {
          label: {
            color: '#fff',
          },
          itemStyle: normalStyle,
        },

        // 区域的特殊配置
        // regions: [
        //   // 南海诸岛JSON或图片二选一，echarts在options.geo.map为china字符串时自动显示南海诸岛图片
        //   // {
        //   //   name: '南海诸岛',
        //   //   itemStyle: {
        //   //     // 隐藏地图
        //   //     normal: {
        //   //       opacity: 0, // 为 0 时不绘制该图形
        //   //     },
        //   //   },
        //   //   label: {
        //   //     show: false, // 隐藏文字
        //   //   },
        //   // },
        // ],
      },

      series: [
        // {
        //   type: 'scatter',
        //   coordinateSystem: 'geo',
        //   symbol: 'pin',
        //   legendHoverLink: true,
        //   symbolSize: [60, 60],
        //   // 这里渲染标志里的内容以及样式
        //   label: {
        //     show: true,
        //     // formatter(value) {
        //     //   return value.data.value[2];
        //     // },
        //     color: '#fff',
        //   },
        //   // 标志的样式
        //   itemStyle: {
        //     color: 'rgba(255,0,0,.7)',
        //     shadowBlur: 2,
        //     shadowColor: 'D8BC37',
        //     // normal: {
        //     // },
        //   },
        //   // 数据格式，其中name,value是必要的，value的前两个值是数据点的经纬度，其他的数据格式可以自定义
        //   // 至于如何展示，完全是靠上面的formatter来自己定义的
        //   data: [
        //     { name: '西藏', value: [91.23, 29.5, 2333] },
        //     { name: '黑龙江', value: [128.03, 47.01, 1007] },
        //   ],
        //   showEffectOn: 'render',
        //   rippleEffect: {
        //     brushType: 'stroke',
        //   },
        //   hoverAnimation: true,
        //   zlevel: 1,
        // },
        {
          type: 'map',
          geoIndex: 0,
          data: [
            {
              name: '广东',
              value: 20,
            },
          ],
        },
      ],

      // 水印类型，文档：https://echarts.apache.org/zh/option.html#graphic.elements-group
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

      visualMap: {
        show: true, // 是否展示左下角，即是是false，也仅是不显示，不影响数据的映射
        text: ['高', '低'], // 上下端文字
        min: 0, // 最小值和最大值，必须指定
        max: 6000,
        left: '10%', // 位置
        bottom: '10%',
        calculable: true, // 是否展示滑块
        seriesIndex: [0], // 指定映射的数据，对应的是options.series，这里根据自己的实际需要进行配置
        inRange: {
          color: ['#00467F', '#A5CC82'], // 从下到上的颜色
        },
        textStyle: {
          color: '#fff', // 字体颜色
          map: 'china',
        },
      },
    } as any; // ECharts的TS类型还有很多问题，大部分定义为object，如果遇到了不符合常理的难题，使用any

    // 第一个参数必须与 options.geo.map 一致
    echarts.registerMap('china', CN as object);
    mapEl.setOption(options);

    mapEl.off('click'); // 防止graph里频繁添加click事件，在添加click事件之前先全部清空掉

    // 监听所有的echarts.click事件，on('click', () => {})，可单独指定 on('click', 'geo', () => {})
    // mapEl.on('click', console.log);
    mapEl.on('click', 'series', async (params: any) => {
      const { name } = params;
      // new map json
      const json = await getNewMap(name, geoJson.value);
      if (Object.keys(json).length === 0) {
        // error message
        return;
      }

      const clear = () => {
        // 当点击完成后，需要删除后续的节点
        const index = options.graphic.findIndex(
          (item: any) => item.style.text === name
        );
        options.graphic.splice(index + 1);
      };

      // exec(); 应放在options.graphic.push后执行，因为graphic需要更新
      const exec = () => {
        clear(); // 先清理，后更新
        echarts.registerMap(name, json);
        options.geo.zoom = 0.8;
        options.geo.map = name;
        mapEl.setOption(options, true); // rerender, it has not animation, see https://github.com/apache/echarts/issues/14069
        geoJson.value = json; // update
      };

      // 将onclick的操作记录到graphic中
      options.graphic.push({
        type: 'text', // group text
        left: (options.graphic.length + 1) * 60, // 进行偏移，从1开始，所以需要加上1
        top: 60,
        // 样式设置
        style: {
          text: name, // 文本内容
          font: 'normal 1rem "Microsoft YaHei", sans-serif', // 字体粗细、大小、字体
          fill: '#fff', // 字体颜色
        },
        onclick: exec, // graphic具有onclick属性，当点击指定的graphic时，恢复原有的map
      });

      exec();
    });

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

  onMounted(async () => {
    init();
  });
</script>

<template>
  <!-- 2xl:container mx-auto  -->
  <div style="width: 100vw; overflow-x: hidden">
    <IHeader ref="headerRef" style="background-color: rgb(141 170 185)" />
    <!-- 99.99 100%会自动溢出，暂时找不到原因 -->
    <div ref="mapRef" />
  </div>
  <!-- <div style="height: 200px"></div> -->
</template>
