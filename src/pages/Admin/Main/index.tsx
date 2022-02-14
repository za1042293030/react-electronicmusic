import React, { FC, ReactElement, useEffect, useState } from 'react';
import { Layout, Menu, Button, message, Popconfirm } from 'antd';
import {
  AlignLeftOutlined,
  PieChartOutlined,
  UserOutlined,
  UnorderedListOutlined,
  PlaySquareOutlined,
  ProfileOutlined,
  OrderedListOutlined,
  CarryOutOutlined,
  GlobalOutlined,
  ReconciliationOutlined
} from '@ant-design/icons';
import './index.less';
import { useSetTitle, useSign, useUserInfo } from '@/hooks';
import { IRouterProps } from '@/common/typings';
import { Link, useHistory } from 'react-router-dom';
import RouterGuard from '@/components/RoutingGuard';

const { Header, Content, Footer, Sider } = Layout;
const { SubMenu } = Menu;

const Main: FC<IRouterProps> = ({ route, location: { state } }): ReactElement => {
  useSetTitle(route?.meta?.title);
  const { userInfo } = useUserInfo();
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
        <Menu theme='dark' defaultSelectedKeys={[location.pathname]} mode='inline' defaultOpenKeys={['审核','管理']}>
          <Menu.Item key='/admin/main/index' icon={<GlobalOutlined />}>
            <Link to='/admin/main/index'>主页</Link>
          </Menu.Item>
          <SubMenu key='审核' icon={<CarryOutOutlined />} title='审核'>
            <Menu.Item key='/admin/main/audit/dynamic' icon={<AlignLeftOutlined />}>
              <Link to='/admin/main/audit/dynamic'>动态</Link>
            </Menu.Item>
            <Menu.Item key='/admin/main/audit/comment' icon={<UnorderedListOutlined />}>
              <Link to='/admin/main/audit/comment'>评论</Link>
            </Menu.Item>
            <Menu.Item key='/admin/main/audit/song' icon={<PlaySquareOutlined />}>
              <Link to='/admin/main/audit/song'>歌曲</Link>
            </Menu.Item>
            <Menu.Item key='/admin/main/audit/album' icon={<ProfileOutlined />}>
              <Link to='/admin/main/audit/album'>专辑</Link>
            </Menu.Item>
            <Menu.Item key='/admin/main/audit/playlist' icon={<OrderedListOutlined />}>
              <Link to='/admin/main/audit/playlist'>歌单</Link>
            </Menu.Item>
          </SubMenu>
          <SubMenu key='管理' icon={<ReconciliationOutlined />} title='管理'>
            <Menu.Item key='6' icon={<UserOutlined />}>用户</Menu.Item>
            <Menu.Item key='7' icon={<PieChartOutlined />}>动态</Menu.Item>
            <Menu.Item key='8' icon={<PieChartOutlined />}>评论</Menu.Item>
            <Menu.Item key='9' icon={<PieChartOutlined />}>歌曲</Menu.Item>
            <Menu.Item key='10' icon={<PieChartOutlined />}>专辑</Menu.Item>
            <Menu.Item key='11' icon={<PieChartOutlined />}>歌单</Menu.Item>
          </SubMenu>
        </Menu>
      </Sider>
      <Layout className='site-layout'>
        <Header className='admin-header'>
          <Popconfirm
            title='确定退出吗？'
            onConfirm={() => logOut()}
            okText='确定'
            cancelText='取消'
          >
            <Button type='primary' danger>
              退出
            </Button>
          </Popconfirm>
          <p>欢迎你,{userInfo?.nickName}</p>
        </Header>
        <Content style={{ margin: '0 16px' }}>
          <div className='site-layout-background' style={{ padding: 24, minHeight: 360 }}>
            <RouterGuard routerConfig={route.children!} />
          </div>
        </Content>
        <Footer style={{ textAlign: 'center' }}>Powered by 张翱</Footer>
      </Layout>
    </Layout>
  );
};
export default Main;
