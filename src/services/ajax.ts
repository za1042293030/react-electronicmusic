import axios, { AxiosPromise, AxiosRequestConfig } from 'axios';
import { BASE_URL, HttpMessage, TOKEN } from '@/common/constants';
import { RESPONSE_CODE } from '@/common/enums';
import { message } from 'antd';
import { BaseResponse, ExceptionResponse, IAjaxResponse } from '@/common/typings';
import store from '@/store';
import { clearUserInfo } from '@/store/actions';

function ajax<T = unknown>(
  config: AxiosRequestConfig
): AxiosPromise<BaseResponse<T> | ExceptionResponse> {
  const instance = axios.create({
    baseURL: BASE_URL,
    timeout: 5000,
    timeoutErrorMessage: '啊哦，请求超时了',
  });
  //响应拦截
  instance.interceptors.response.use(
    (response: IAjaxResponse<T>) => {
      if (response.data.code === RESPONSE_CODE.FAIL) {
        message.error(response.data.message);
        return Promise.reject(response);
      } else return Promise.resolve(response);
    },
    error => {
      const msg: string =
        error?.response?.data?.message ||
        HttpMessage.get(error?.response?.status) ||
        error?.response?.data ||
        error.message;
      const status = error?.response?.status ?? '';
      if (msg.includes('过期')) {
        store.dispatch(clearUserInfo());
      }
      console.log('error status:' + status);
      message.destroy();
      message.error(msg);
    }
  );
  //请求拦截
  instance.interceptors.request.use(
    request => {
      request.headers[TOKEN] = localStorage.getItem(TOKEN);
      return request;
    },
    error => {
      message.error('请求失败（' + error + '）');
    }
  );
  return instance(config);
}
export { ajax };
