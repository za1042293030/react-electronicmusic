import { ComponentType, LazyExoticComponent } from 'react';
import { RouteComponentProps } from 'react-router-dom';

interface IRouterMeta {
  //登录验证
  auth?: boolean;
  //标题
  title?: string;
  //跳转路由是否销毁
  keepAlive?: boolean;
}

/**
 * 路由配置
 */
interface IRouterConfig {
  //路径
  path: string;
  //组件或懒组件
  component: LazyExoticComponent<ComponentType<any>> | ComponentType<any>;
  //子路由
  children?: IRouter[];
  //配置选项
  meta?: IRouterMeta;
}

/**
 * 路由重定向配置
 */
interface IRouterRedirect {
  //路径
  path: string;
  //重定向路径
  redirect: string;
}

//路由组件传值
interface IRouterProps<T = {}> extends RouteComponentProps<T, { statusCode?: number }, any> {
  route: IRouterConfig;
}

interface ILink {
  path: string;
  name: string;
  icon: ComponentType<any>;
}

type IRouter = IRouterConfig | IRouterRedirect;

interface IParams {
  id: string;
}

export type { IRouterConfig, IRouterRedirect, IRouter, IRouterProps, ILink, IParams };
