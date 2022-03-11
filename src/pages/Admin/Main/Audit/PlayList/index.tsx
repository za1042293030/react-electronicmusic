import {
  IDynamic,
  IPlayListSimple,
  IRouterProps,
  IUserSimple,
} from '@/common/typings';
import { useSetTitle } from '@/hooks';
import React, { FC, ReactElement, useEffect, useState } from 'react';
import { If } from '@/components';
import { Image, Space, Table } from 'antd';
import api from '@/services';
import { isEmpty } from 'lodash';
import moment from 'moment';

const { Column } = Table;

interface IState {
  loading: boolean;
  total: number;
  data: IPlayListSimple[];
  pageIndex: number;
  pageSize: number;
}

const PlayList: FC<IRouterProps> = ({ route }): ReactElement => {
  useSetTitle(route.meta?.title!);

  const [{ loading, total, data, pageIndex, pageSize }, setState] = useState<IState>({
    loading: false,
    total: 0,
    data: [],
    pageSize: 20,
    pageIndex: 1,
  });

  const loadData = async () => {
    setState(state => ({
      ...state,
      loading: true,
    }));
    const res = await api.admin.getApprovingPlayLists(pageIndex, pageSize);
    if (!res) return;
    setState(state => ({
      ...state,
      data: !res || isEmpty(res?.data) ? [] : ((res.data as IPlayListSimple[]).map(item => ({
        ...item,
        visible: false,
      }))),
      total: res ? res.totalCount : 0,
      loading: false,
    }));
  };

  useEffect(() => {
    loadData();
  }, [pageSize, pageIndex]);

  const onShowSizeChange = (current: number, pageSize: number) => {
    setState(state => ({
      ...state,
      pageSize,
    }));
  };

  const onChange = (pageIndex: number) => {
    setState(state => ({
      ...state,
      pageIndex,
    }));
  };

  const changePlayListsAuditStatus = async (id: number, status: number) => {
    await api.admin.changePlayListsAuditStatus(id, status);
    loadData();
  };

  return (
    <div>
      <Table
        scroll={{ y: 630 }}
        rowKey='id'
        dataSource={data}
        pagination={{
          pageSize,
          position: ['bottomCenter'],
          total,
          showSizeChanger: true,
          onShowSizeChange,
          defaultPageSize: pageSize,
          onChange,
        }}
        size='large'
        loading={loading}
      >
        <Column
          title='名字'
          dataIndex='name'
          key='name'
          width={200}
          render={(name) => (
            <span>
              {name}
            </span>
          )}
        />
        <Column
          title='描述'
          dataIndex='describe'
          key='describe'
          width='33%'
          render={(describe) => (
            <span>
              {describe ?? '无'}
            </span>
          )}
        />
        <Column
          title='封面'
          dataIndex='cover'
          key='cover'
          width={200}
          render={(cover) => (
            <If flag={!cover} element1='无' element2={<div
              style={{
                maxHeight: '20rem',
                overflow: 'hidden',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Image src={cover} />
            </div>
            } />
          )}
        />
        <Column
          title='创建人'
          dataIndex='createBy'
          key='createBy'
          width={200}
          render={(createBy: IUserSimple) => (
            <span>
              {createBy.nickName}
            </span>
          )}
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
          render={(_r, comment: IDynamic) => (
            <Space>
              <a onClick={() => changePlayListsAuditStatus(comment.id, 1)}>同意</a>
              <a style={{ color: '#ff0000' }} onClick={() => changePlayListsAuditStatus(comment.id, 2)}>驳回</a>
            </Space>
          )}
        />
      </Table>
    </div>
  );
};
export default PlayList;
