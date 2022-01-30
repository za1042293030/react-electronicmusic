import React, { Menu } from 'antd';
import { AppstoreOutlined, MailOutlined, SettingOutlined } from '@ant-design/icons';
import { FC, memo, ReactElement } from 'react';

const { SubMenu, Item } = Menu;

const Sider: FC = (): ReactElement => {
  return (
    <Menu mode="inline" style={{ width: 25 + 'rem' }} defaultSelectedKeys={['all']}>
      <Item key="all">全部</Item>
      <SubMenu key="sub1" icon={<MailOutlined />} title="House">
        <Item key="1">Progressive House</Item>
        <Item key="2">Future House</Item>
        <Item key="3">Deep Houst</Item>
      </SubMenu>
      <SubMenu key="sub2" icon={<AppstoreOutlined />} title="Bass">
        <Item key="5">Dubstep</Item>
        <Item key="6">Trap</Item>
      </SubMenu>
      <SubMenu key="sub4" icon={<SettingOutlined />} title="Navigation Three">
        <Item key="9">Option 9</Item>
        <Item key="10">Option 10</Item>
        <Item key="11">Option 11</Item>
        <Item key="12">Option 12</Item>
      </SubMenu>
    </Menu>
  );
};
export default memo(Sider);
