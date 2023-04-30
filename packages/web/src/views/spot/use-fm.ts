interface IMonthOrFeature {
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

export const features = [
  { alias: 'mountain', name: '山' },
  { alias: 'water', name: '水' },
  { alias: 'forest', name: '林' },
  { alias: 'grass', name: '草' },
  { alias: 'sand', name: '沙' },
  { alias: 'soil', name: '土' },
  { alias: 'humanity', name: '人文' },
  { alias: 'modern', name: '现代' },
];

export default function useFM() {
  /**
   * 按照月份顺序进行排名
   * @param _months
   * @returns
   */
  const sortMonths = (_months: IMonthOrFeature[]) => {
    return months.reduce((target, month) => {
      const item = _months.find((v) => v.name === month.name);
      if (item) {
        target.push(item);
      }
      return target;
    }, [] as IMonthOrFeature[]);
  };

  return { sortMonths, months, features };
}
