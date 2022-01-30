import { IRouter, IRouterConfig } from '@/common/typings';
import routerConfig from '@/router';
/**
 * 寻找路由
 * @param path
 * @param router
 * @returns
 */
function findRoute(path: string, router: IRouter[] = routerConfig): IRouterConfig | undefined {
  for (const route of router.filter(route => 'component' in route) as IRouterConfig[]) {
    if (route.path === path) {
      return route;
    }
    if (route.children) {
      const result = findRoute(path, route.children);
      if (!result) continue;
      else return result;
    }
  }
}
/**
 * 寻找子路由
 * @param path
 * @param router
 */
function findRouteChildren(path: string, router: IRouter[] = routerConfig): IRouter[] | undefined {
  return findRoute(path, router)?.children;
}
export { findRoute, findRouteChildren };
