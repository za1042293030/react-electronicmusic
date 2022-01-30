import { linkList } from '@/common/constants';
import { IRouterProps } from '@/common/typings';
import { Footer, Header, RoutingGuard, If, Audio } from '@/components';
import { useUserInfo } from '@/hooks';
import { CaretUpOutlined } from '@ant-design/icons';
import { BackTop } from 'antd';
import React, { FC, ReactElement } from 'react';
import './index.less';

const Client: FC<IRouterProps> = ({ route }): ReactElement => {
  const { isLogin } = useUserInfo();
  return (
    <div className="client">
      <Header linkList={linkList} />
      <RoutingGuard routerConfig={route.children!} />
      <If flag={isLogin} element1={<Audio />} />
      <Footer />
      <BackTop>
        <div className="back-to-up">
          <CaretUpOutlined />
        </div>
      </BackTop>
    </div>
  );
};
export default Client;
