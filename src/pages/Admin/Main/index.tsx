import React, { FC, ReactElement, useEffect, useState } from 'react';
import { Layout, Menu, Button, message } from 'antd';
import {
  DesktopOutlined,
  PieChartOutlined,
  FileOutlined,
  TeamOutlined,
  UserOutlined,
} from '@ant-design/icons';
import './index.less';
import { useSign, useUserInfo } from '@/hooks';
import { IRouterProps } from '@/common/typings';
import { useHistory } from 'react-router-dom';
const { Header, Content, Footer, Sider } = Layout;
const { SubMenu } = Menu;

const Main: FC<IRouterProps> = ({ location: { state } }): ReactElement => {
  const {
    userInfo: { nickName },
  } = useUserInfo();

  const history = useHistory();
  const { isAdmin } = useUserInfo();
  const { logOut } = useSign();

  useEffect(() => {
    if (!isAdmin && !state?.admin) {
      message.warn('您不是管理员');
      history.replace('/');
    }
  }, []);

  const [collapsed, setCollapsed] = useState(false);
  const onCollapse = (collapsed: boolean) => {
    setCollapsed(collapsed);
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider collapsible collapsed={collapsed} onCollapse={onCollapse}>
        <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline">
          <Menu.Item key="1" icon={<PieChartOutlined />}>
            Option 1
          </Menu.Item>
          <Menu.Item key="2" icon={<DesktopOutlined />}>
            Option 2
          </Menu.Item>
          <SubMenu key="sub1" icon={<UserOutlined />} title="User">
            <Menu.Item key="3">Tom</Menu.Item>
            <Menu.Item key="4">Bill</Menu.Item>
            <Menu.Item key="5">Alex</Menu.Item>
          </SubMenu>
          <SubMenu key="sub2" icon={<TeamOutlined />} title="Team">
            <Menu.Item key="6">Team 1</Menu.Item>
            <Menu.Item key="8">Team 2</Menu.Item>
          </SubMenu>
          <Menu.Item key="9" icon={<FileOutlined />}>
            Files
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout className="site-layout">
        <Header className="admin-header">
          <Button type="primary" danger onClick={logOut}>
            退出
          </Button>
          <p>欢迎你,{nickName}</p>
        </Header>
        <Content style={{ margin: '0 16px' }}>
          <div className="site-layout-background" style={{ padding: 24, minHeight: 360 }}>
            Bill is a cat.
          </div>
        </Content>
        <Footer style={{ textAlign: 'center' }}>Powered by 张翱</Footer>
      </Layout>
    </Layout>
  );
};
export default Main;
