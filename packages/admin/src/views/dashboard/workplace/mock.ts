import Mock from 'mockjs';
import qs from 'query-string';
import dayjs from 'dayjs';
import setupMock, { successResponseWrap } from '@/utils/setup-mock';

setupMock({
  setup() {
    Mock.mock(new RegExp('/api/content-data'), () => {
      const presetData = [58, 81, 53, 90, 64, 88, 49, 79];
      const getLineData = () => {
        const count = 8;
        return new Array(count).fill(0).map((el, idx) => ({
          date: dayjs()
            .day(idx - 2)
            .format('YYYY-MM-DD'),
          value: presetData[idx],
        }));
      };
      return successResponseWrap([...getLineData()]);
    });
  },
});
