import { IRouterProps, ISearchAlbum, IUserSimple } from '@/common/typings';
import { useSetTitle } from '@/hooks';
import React, { FC, ReactElement, useEffect, useState } from 'react';
import { For } from '@/components';
import { Badge, Dropdown, Menu, Space, Table } from 'antd';
import api from '@/services';
import { isEmpty } from 'lodash';
import { DownOutlined } from '@ant-design/icons';

const { Column } = Table;

interface IState {
  loading: boolean;
  total: number;
  data: ISearchAlbum[];
  pageIndex: number;
  pageSize: number;
}

const Album: FC<IRouterProps> = ({ route }): ReactElement => {
  useSetTitle(route.meta?.title!);

  const [{ loading, total, data, pageIndex, pageSize }, setState] = useState<IState>({
    loading: false,
    total: 0,
    data: [],
    pageSize: 10,
    pageIndex: 1,
  });

  useEffect(() => {
    const loadData = async () => {
      const res = await api.admin.getApprovingAlbums(pageIndex, pageSize);
      if (!res) return;
      setState(state => ({
        ...state,
        data: !res || isEmpty(res?.data) ? [] : (res.data as ISearchAlbum[]),
        total: res ? res.totalCount : 0,
      }));
    };
    loadData();
  }, [pageSize, pageIndex]);

  function onShowSizeChange(current: number, pageSize: number) {
    console.log(pageSize);
    setState(state => ({
      ...state,
      pageSize,
    }));
  }

  const menu = (
    <Menu>
      <Menu.Item>Action 1</Menu.Item>
      <Menu.Item>Action 2</Menu.Item>
    </Menu>
  );

  const expandedRowRender = () => {
    const columns = [
      { title: 'Date', dataIndex: 'date', key: 'date' },
      { title: 'Name', dataIndex: 'name', key: 'name' },
      {
        title: 'Status',
        key: 'state',
        render: () => (
          <span>
            <Badge status='success' />
            Finished
          </span>
        ),
      },
      { title: 'Upgrade Status', dataIndex: 'upgradeNum', key: 'upgradeNum' },
      {
        title: 'Action',
        dataIndex: 'operation',
        key: 'operation',
        render: () => (
          <Space size='middle'>
            <a>Pause</a>
            <a>Stop</a>
            <Dropdown overlay={menu}>
              <a>
                More <DownOutlined />
              </a>
            </Dropdown>
          </Space>
        ),
      },
    ];

    const data = [];
    for (let i = 0; i < 3; ++i) {
      data.push({
        key: i,
        date: '2014-12-24 23:12:00',
        name: 'This is production name',
        upgradeNum: 'Upgraded: 56',
      });
    }
    return <Table columns={columns} dataSource={data} pagination={false} />;
  };

  return (
    <div>
      <Table
        rowKey='id'
        dataSource={data}
        pagination={{
          pageSize,
          position: ['bottomCenter'],
          total,
          showSizeChanger: true,
          onShowSizeChange,
        }}
        size='large'
        loading={loading}
        expandable={{ expandedRowRender }}
      >
        <Column
          title='名字'
          dataIndex='content'
          key='content'
          render={name => (
            <span
              className='pointer'
            >
            {name}
          </span>
          )}
        />
        <Column
          title='专辑'
          dataIndex='album'
          key='album'
          render={album => (
            <span
              className='pointer'
            >
                {album?.name}
              </span>
          )}
        />
        <Column
          title='制作人'
          dataIndex='artists'
          key='artists'
          render={(artists: IUserSimple[]) => (
            <For data={artists} emptyEl={false}>
              {(artist: IUserSimple, index) => (
                <span
                  key={artist.id}
                  className='pointer'
                >
                {artist.nickName}
                  {index === artists.length - 1 ? null : ','}
              </span>
              )}
            </For>
          )}
        />
        <Column
          title='操作'
          width={200}
          key='handle'
          render={() => (
            <>
              <a type='primary'>同意</a>
              <a style={{ color: '#ff0000' }}>驳回</a>
            </>
          )}
        />
      </Table>
    </div>
  );
};
export default Album;
