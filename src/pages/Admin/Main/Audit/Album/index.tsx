import { IRouterProps, ISearchAlbum, ISearchSong, IUserSimple } from '@/common/typings';
import { useSetTitle } from '@/hooks';
import React, { FC, ReactElement, useEffect, useState } from 'react';
import { PlayCircleOutlined } from '@ant-design/icons';
import { For } from '@/components';
import { Button, Table } from 'antd';
import api from '@/services';
import { getApprovingAlbums } from '@/services/album';
import { isEmpty } from 'lodash';

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
        size="large"
        loading={loading}
      >
        <Column
          title='名字'
          dataIndex='content'
          key='content'
          render={(name, song: ISearchSong) => (
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
              <Button type='primary'>同意</Button>
              <Button type='primary' danger>驳回</Button>
            </>
          )}
        />
      </Table>
    </div>
  );
};
export default Album;
