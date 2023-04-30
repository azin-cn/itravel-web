interface Month {
  id: string;
  name: string;
}

export const months = [
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
];

/**
 * 按照月份顺序进行排名
 * @param _months
 * @returns
 */
export function sortMonths(_months: Month[]) {
  return months.reduce((target, month) => {
    const item = _months.find((v) => v.name === month.name);
    if (item) {
      target.push(item);
    }
    return target;
  }, [] as Month[]);
}
