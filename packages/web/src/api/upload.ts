import axios from 'axios';
import { prefix } from './base';

export type IFORM = FormData;

export function postFile(form: FormData) {
  /**
   * 因为axios中默认拦截判断errCode，这里尝试使用fetch配置，当然可以生成新的axios使用
   * some case
   */

  return fetch(`https://www.picgo.net/api/azin/upload`, {
    method: 'POST',
    body: form,
  }).then((res) => res.json());
}

/**
 * 图像 response
 */
export interface ImgFileModel {
  url: string;
  name: string;
}

/**
 * 上传文件
 * @param form
 * @returns
 */
export function uploadFile(form: FormData) {
  return axios.post<ImgFileModel>(`${prefix}/upload`, form);
}
