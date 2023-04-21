export default function useECharts() {
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

  // 提示浮窗样式
  const optionsTooltip = {
    show: true,
    trigger: 'item',
    alwaysShowContent: false,
    // backgroundColor: '#0C121C',
    borderColor: 'rgba(0, 0, 0, 0.16);',
    extraCssText: 'background-color: rgba(0,0,0,0.3); color:#fff',
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
    formatter(params: any) {
      // console.log('params =', params);
      const { name, data, color = 'red', seriesName } = params;

      if (!data) {
        return `
        <div>
          <div> ${name} </div>
          <div> 暂无数据 </div>
        </div>
        `;
      }

      return `
        <div>
          <div> ${name} </div>
          <div> 景点 · ${data.value} </div>
        </div>
      `;
    },
  };

  // 地图配置
  const optionsGeo = {
    map: 'china',
    roam: true,
    left: '20%',
    top: 'center',
    // zoom: 1,
    scaleLimit: {
      min: 0.8,
      max: 3,
    },
    label: {
      normal: {
        show: true,
        textStyle: {
          color: '#fff', // 文字通常状态下的样式
        },
      },
      emphasis: {
        textStyle: {
          color: '#fff', // 文字在鼠标放上去的样式
        },
      },
    },
    // 地图区域的样式设置
    itemStyle: {
      normal: normalStyle, // 正常状态下的显示
      emphasis: {
        areaColor: '#389BB7', // 鼠标放上去高亮的样式
        borderWidth: 0,
      },
    },
    select: {
      label: {
        color: '#fff', // 点击选中时的颜色
      },
      itemStyle: normalStyle,
    },
  };

  const optionsVisualMap = [
    {
      show: true, // 是否展示左下角，即是是false，也仅是不显示，不影响数据的映射
      text: ['高', '低'], // 上下端文字
      min: 0, // 最小值和最大值，必须指定
      max: 2000,
      left: '10%', // 位置
      bottom: '10%',
      calculable: true, // 是否展示滑块
      seriesIndex: [0], // 指定映射的数据，对应的是options.series，这里根据自己的实际需要进行配置
      inRange: {
        color: ['#467', '#93ebf8'], // 从下到上的颜色
      },
      textStyle: {
        color: '#fff', // 字体颜色
        map: 'china',
      },
    },
  ];

  return {
    normalStyle,
    optionsTooltip,
    optionsGeo,
    optionsVisualMap,
  };
}
