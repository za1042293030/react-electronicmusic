import { HttpStatus } from '../enums';

const BASE_URL = location.origin;

const TOKEN = 'token';

const HttpMessage = new Map<HttpStatus, string>([
  [HttpStatus.BAD_REQUEST, '客户端请求的语法错误'],
  [HttpStatus.UNAUTHORIZED, '您无权限访问此资源'],
  [HttpStatus.FORBIDDEN, '对请求资源的访问被服务器拒绝'],
  [HttpStatus.NOT_FOUND, '您所请求的资源无法找到'],
  [HttpStatus.REQUEST_TIMEOUT, '请求超时'],
  [HttpStatus.INTERNAL_SERVER_ERROR, '服务器内部错误，无法完成请求'],
  [HttpStatus.BAD_GATEWAY, '服务器宕机，请联系管理员'],
  [HttpStatus.SERVICE_UNAVAILABLE, '服务器暂时的无法处理客户端的请求'],
  [HttpStatus.GATEWAY_TIMEOUT, '未及时从服务器获取请求结果'],
]);

export { BASE_URL, TOKEN, HttpMessage };
