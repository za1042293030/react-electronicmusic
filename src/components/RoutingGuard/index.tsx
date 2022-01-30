import React, { FC, ReactElement, Suspense } from 'react';
import { Redirect, Route, useLocation, RouteComponentProps } from 'react-router-dom';
import { IRouterConfig, IRouterRedirect } from '@/common/typings';
import { IProps } from './props';
import { Loading } from '@/components';
import { TransitionGroup } from 'react-transition-group';
import './index.less';
import { message } from 'antd';
import { useUserInfo } from '@/hooks';
import { CacheSwitch, CacheRoute } from 'react-router-cache-route';

const RedirectTo404: FC = (): ReactElement => <Redirect to="/404" />;

const RoutingGuard: FC<IProps> = ({ routerConfig }): ReactElement => {
  const { pathname } = useLocation();
  const redirect = routerConfig.find(config => 'redirect' in config) as IRouterRedirect | undefined;
  if (redirect && pathname === redirect.path) {
    return <Redirect from={redirect.path} to={redirect.redirect} />;
  }
  const { isLogin, isAdmin } = useUserInfo();

  const authToPath = (route: IRouterConfig, props: RouteComponentProps<any>) => {
    const msg = '请登录后再执行此操作';
    if (isLogin && (pathname === '/admin/login' || pathname === '/admin')) {
      if (isAdmin) {
        return <Redirect to="/admin/main" />;
      } else {
        message.warn('您不是管理员');
        return <Redirect to="/" />;
      }
    }
    if (
      (isLogin && pathname === '/client/sign/login') ||
      (isLogin && pathname === '/client/sign/register')
    ) {
      return <Redirect to="/" />;
    }
    if (route.meta?.auth && !isLogin) {
      message.info(msg);
      return <Redirect to="/client/sign/login" />;
    }
    return <route.component {...props} route={route} />;
  };

  return (
    <>
      <TransitionGroup>
        <Suspense fallback={<Loading golbal />}>
          <CacheSwitch>
            {routerConfig &&
              (routerConfig as IRouterConfig[]).map(route => {
                return !route.meta?.keepAlive ? (
                  <Route
                    strict
                    key={route.path}
                    exact={!route.children}
                    path={route.path}
                    render={props => authToPath(route, props)}
                  />
                ) : (
                  <CacheRoute
                    strict
                    key={route.path}
                    exact={!route.children}
                    path={route.path}
                    render={props => authToPath(route, props)}
                  />
                );
              })}
            <Route component={RedirectTo404} />
          </CacheSwitch>
        </Suspense>
      </TransitionGroup>
    </>
  );
};
export default RoutingGuard;
