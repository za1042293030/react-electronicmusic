import { AxiosResponse } from 'axios';
import { RESPONSE_CODE, HttpStatus } from '@/common/enums';
/**
 * 请求结果模型
 */
class BaseResponse<T = any> {
  code: RESPONSE_CODE;
  message: string;
  data: T;

  constructor(code: RESPONSE_CODE, message: string, data: T) {
    this.code = code;
    this.message = message;
    this.data = data;
  }
}

/**
 * 请求异常结果模型
 */
class ExceptionResponse extends BaseResponse<null> {
  status: HttpStatus;
  errorUrl: string;

  constructor(code: RESPONSE_CODE, status: HttpStatus, errorMessage: string, errorUrl: string) {
    super(code, errorMessage, null);
    this.status = status;
    this.errorUrl = errorUrl;
  }
}

type IAjaxResponse<T = any> = AxiosResponse<BaseResponse<T> | ExceptionResponse>;
export type { BaseResponse, ExceptionResponse, IAjaxResponse };
