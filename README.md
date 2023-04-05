使用 ECharts 画中国地图

options 准备

### 遇到的问题

1. visualMap 需要触发改动数据后才能监听到事件，对本次功能来说显得麻烦，使用 legend 即可

```js
const dataset = {
  // 用 dimensions 指定了维度的顺序。如果不指定 dimensions，也可以通过指定 series.encode
  name: {
    gd: '广东'
  },
  months: [
      '一月',
      '二月',
      '三月',
      '四月',
      '五月',
      '六月',
      '七月',
      '八月',
      '九月',
      '十月',
      '十一月',
      '十二月'
  ],
  special: ['山', '水', '林', '草', '沙', '土', '人文', '现代'],

  dimensions: [
    'name', 'value',
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
    'mountain', 'water', 'forest', 'grass', 'sand', 'soil', 'humanity', 'modern'
  ],
  name: 区域名称
  source: [
    {
      name: '广东', value: 433,
      Jan: 433, Feb: 433, Mar: 433, Apr: 433, May: 433, Jun: 433,
      Jul: 433, Aug: 433, Sep: 433, Oct: 433, Nov: 433, Dec: 433,
      mountain: 433, water: 433, forest: 433, grass: 433,
      sand: 433, soil: 433, humanity: 433, modern: 433,
    },
    {
      name: '新疆', value: 433,
      Jan: 433, Feb: 433, Mar: 433, Apr: 433, May: 433, Jun: 433,
      Jul: 433, Aug: 433, Sep: 433, Oct: 433, Nov: 433, Dec: 433,
      mountain: 433, water: 433, forest: 433, grass: 433,
      sand: 433, soil: 433, humanity: 433, modern: 433,
    },
  ]
},
```