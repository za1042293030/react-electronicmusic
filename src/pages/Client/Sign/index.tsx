import { IRouterProps } from '@/common/typings';
import { RoutingGuard } from '@/components';
import { useSetTitle } from '@/hooks';
import store from '@/store';
import { Menu } from 'antd';
import React, { FC, Key, ReactElement, useCallback, useState } from 'react';
import { Provider } from 'react-redux';
import { Link } from 'react-router-dom';
import './index.less';

const Login: FC<IRouterProps> = ({ route, location }): ReactElement => {
  useSetTitle(route.meta?.title!);
  const [selectedKey, setSelectedKey] = useState<['1'] | ['2']>(
    location.pathname.includes('login') ? ['1'] : ['2']
  );
  const onSelect = useCallback(({ key }: { key: Key }) => {
    setSelectedKey([key as '1' | '2']);
  }, []);

  return (
    <div className="login">
      <main className="main">
        <div className="sign-form-container transition-2">
          <div className="sign-header">
            <Menu mode="horizontal" defaultSelectedKeys={selectedKey} onSelect={onSelect}>
              <Menu.Item key="1">
                <Link to="/client/sign/login">登录</Link>
              </Menu.Item>
              <Menu.Item key="2">
                <Link to="/client/sign/register">注册</Link>
              </Menu.Item>
            </Menu>
          </div>
          <div className="sign-form transition-2">
            <Provider store={store}>
              <RoutingGuard routerConfig={route.children!} />
            </Provider>
          </div>
        </div>
      </main>
    </div>
  );
};
export default Login;
