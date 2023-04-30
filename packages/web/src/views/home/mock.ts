import Mock from 'mockjs';
import setupMock, { successResponseWrap } from '@/utils/setup-mock';

setupMock({
  setup: () => {
    const { Random } = Mock;

    const names = [
      'name',
      'value',
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
      'mountain',
      'water',
      'forest',
      'grass',
      'sand',
      'soil',
      'humanity',
      'modern',
    ];
    const genData = () =>
      names.reduce((target, curr) => {
        if (curr === 'name') {
          target[curr] = Random.province();
        } else if (curr === 'value') {
          target[curr] = Random.integer(1000, 6000);
        } else {
          target[curr] = Random.integer(100, 600);
        }
        return target;
      }, {} as any);

    const getSeries = () =>
      Array.from(new Array(Random.integer(10, 20)), genData);

    Mock.mock(new RegExp('/api/series'), () => {
      return successResponseWrap(getSeries());
    });
  },
});
