import { IRouterProps, ISearchAlbum, IStyle, IUserSimple } from '@/common/typings';
import { useSetTitle } from '@/hooks';
import React, { FC, ReactElement, useEffect, useState } from 'react';
import { For } from '@/components';
import { Space, Table, Tag } from 'antd';
import api from '@/services';
import { isEmpty } from 'lodash';
import moment from 'moment';

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

  const loadData = async () => {
    setState(state => ({
      ...state,
      loading: true,
    }));
    const res = await api.admin.getApprovingAlbums(pageIndex, pageSize);
    if (!res) return;
    setState(state => ({
      ...state,
      data: !res || isEmpty(res?.data) ? [] : (res.data as ISearchAlbum[]),
      total: res ? res.totalCount : 0,
      loading: false,
    }));
  };

  useEffect(() => {
    loadData();
  }, [pageSize, pageIndex]);

  function onShowSizeChange(current: number, pageSize: number) {
    setState(state => ({
      ...state,
      pageSize,
    }));
  }

  const expandedRowRender = (record: ISearchAlbum) => {
    const columns = [
      {
        title: '封面',
        dataIndex: 'cover',
        key: 'cover',
        width: 6,
        render: (cover: string) => <img src={cover} style={{ maxHeight: '6rem' }} />,
      },
      { title: '名字', dataIndex: 'name', key: 'name', width: 200 },
      { title: '描述', dataIndex: 'describe', key: 'describe' },
      {
        title: '风格',
        dataIndex: 'styles',
        key: 'styles',
        width: 200,
        render: (styles: IStyle[]) => <>{styles.map(style => <Tag>{style.name}</Tag>)}</>,
      },
      {
        title: '制作人',
        dataIndex: 'artists',
        key: 'artist',
        width: 200,
        render: (artists: IUserSimple[]) => (
          <For data={artists} emptyEl={false}>
            {(artist: IUserSimple, index) => (
              <span
                key={artist.id}
              >
                {artist.nickName}
                {index === artists.length - 1 ? null : ','}
              </span>
            )}
          </For>
        ),
      },
      {
        title: '文件', dataIndex: 'file', key: 'file', width: 200, render: (file: string) =>
          <audio src={file} controls></audio>
        ,
      },
    ];
    return <Table columns={columns} dataSource={record.songs} pagination={false} />;
  };

  const changeAlbumsAuditStatus = async (id: number, status: number) => {
    await api.admin.changeAlbumsAuditStatus(id, status);
    loadData();
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
          title='封面'
          dataIndex='cover'
          key='cover'
          width={100}
          render={cover => (
            <img
              src={cover}
              style={{ maxHeight: '10rem' }}
            />
          )}
        />
        <Column
          title='名字'
          dataIndex='name'
          key='name'
          width={250}
        />
        <Column
          title='描述'
          dataIndex='describe'
          key='describe'
          render={describe => (
            <>
              {describe ?? '无'}
            </>
          )}
        />
        <Column
          title='创建人'
          dataIndex='createBy'
          key='createBy'
          width={200}
          render={(createBy: IUserSimple) =>
            <p>{createBy.nickName}</p>}
        />
        <Column
          title='创建时间'
          dataIndex='createTime'
          key='createTime'
          width={200}
          render={(createTime) => (
            <span>
              {moment(createTime).format('lll')}
            </span>
          )}
        />
        <Column
          title='操作'
          width={200}
          key='handle'
          render={(_r, album: ISearchAlbum) => (
            <Space>
              <a onClick={() => changeAlbumsAuditStatus(album.id, 1)}>同意</a>
              <a style={{ color: '#ff0000' }}
                 onClick={() => changeAlbumsAuditStatus(album.id, 2)}>驳回</a>
            </Space>
          )}
        />
      </Table>
    </div>
  );
};
export default Album;
