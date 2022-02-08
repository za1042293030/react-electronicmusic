import React, { ReactElement, useEffect } from 'react';
import { RoutingGuard } from '@/components';
import { useUserInfo } from './hooks';
import { DEFAULT_TITLE, TOKEN } from './common/constants';
import routerConfig from './router';
import './App.less';
import { message } from 'antd';
import { decode } from 'jsonwebtoken';
import { IJwtPayload } from './common/typings';
function App(): ReactElement {
  const { saveUserInfo, saveAdminInfo } = useUserInfo();

  useEffect(() => {
    document.title = DEFAULT_TITLE;
    document.documentElement.style.fontSize = '62.5%';
    window.scroll(0, 0);
    /* const preventTokenUpdate = (event: StorageEvent) => {
      localStorage.setItem(event.key!, event.oldValue!);
    }; */
    // window.addEventListener('storage', preventTokenUpdate);
    const offLineFn = () => {
      message.error('网络不太给力呀');
    };
    window.addEventListener('offline', offLineFn);
    const token = localStorage.getItem(TOKEN);
    if (token) {
      const info = decode(token) as IJwtPayload;
      info.isAdmin ? saveAdminInfo(info.id) : saveUserInfo(info.id);
    } else {
      localStorage.removeItem('userInfo');
    }
    return () => {
      window.removeEventListener('offline', offLineFn);
      // window.removeEventListener('storage', preventTokenUpdate);
    };
  }, []);
  return (
    <div className="app">
      <RoutingGuard routerConfig={routerConfig} />
    </div>
  );
}

export default App;
