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

## 利用闭包解决网络时延问题

在对同一个接口快速请求多次时，由于网络时延的问题，前一次请求的数据不一定比后一次请求的数据先返回。此时由于前一次请求的数据后返回，会把后一次返回的数据覆盖，形成数据错乱。

### 分析原因

这是由于网络时延和快速触发的行为共同造成的

### 解决方案

- 点击以后只有数据返回了才能继续点击
- 全局记录一个数据 counter，每点击一次请求 counter 自增 1
  - 在函数内记录当前的 counter，请求完成后对比前后的 counter，一致则赋值，否则取消赋值

```ts
const counter = ref(0);

const request = async () => {
  counter.value += 1;
  const inner = counter.value;
  const { data } = await getData();
  if (inner === counter.value) {
    setData(data);
  }
};
```

## 记录一次响应式设计

home/components/hot-tours.vue:mainTours
lg:self-center
md:self-start

## 当地区没有数据时，可以选择不允许进去地区查看

```ts
mapEl.on('click', 'series');
/**
 * 如果数据不存在，则可以选择不允许进入
 * if(!data) { Message.warning("没有数据") }
 */
```

## 记录动态切换 class 时，:deep(selector) 可能出现失败的过程

具体的情况如下：

在 editor 的 a-form>a-form-item>.arco-select-view-multiple 选择时，由于会进行多选择的切换，在进行多个选择时，border-color: unset 会失效，具体原因还未探究，记录现象待以后寻找原因。

解决的方法是，不使用:deep和scoped，利用自定义类实现样式隔离
