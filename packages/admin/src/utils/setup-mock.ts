import debug from './env';

export default ({ mock, setup }: { mock?: boolean; setup: () => void }) => {
  if (mock !== false && debug) setup();
};

export const successResponseWrap = (data: unknown) => {
  return {
    data,
    status: 'ok',
    errMsg: '请求成功',
    errCode: 200,
  };
};

export const failResponseWrap = (
  data: unknown,
  errMsg = '请求失败',
  errCode = 500
) => {
  return {
    data,
    status: 'fail',
    errMsg,
    errCode,
  };
};
