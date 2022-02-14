import {
  IComment,
  IDynamic,
  IDynamicPic, IDynamicSong,
  IRouterProps,
  IUserSimple,
} from '@/common/typings';
import { useSetTitle } from '@/hooks';
import React, { FC, ReactElement, useEffect, useState } from 'react';
import { For, If } from '@/components';
import { Button, Image, Space, Table } from 'antd';
import api from '@/services';
import { isEmpty } from 'lodash';
import moment from 'moment';

const { Column } = Table;

interface IState {
  loading: boolean;
  total: number;
  data: IComment[];
  pageIndex: number;
  pageSize: number;
}

const Comment: FC<IRouterProps> = ({ route }): ReactElement => {
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
    const res = await api.admin.getApprovingComments(pageIndex, pageSize);
    if (!res) return;
    setState(state => ({
      ...state,
      data: !res || isEmpty(res?.data) ? [] : ((res.data as IComment[]).map(item => ({
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

  const changeCommentsAuditStatus = async (id: number, status: number) => {
    await api.admin.changeCommentsAuditStatus(id, status);
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
          title='内容'
          dataIndex='content'
          key='content'
          width='33%'
          render={(content) => (
            <span>
              {content}
            </span>
          )}
        />
        <Column
          title='回复人'
          dataIndex='replyTo'
          key='replyTo'
          width={200}
          render={(replyTo: IUserSimple) => (
            <span>
              {replyTo?.nickName ?? '无'}
            </span>
          )}
        />
        <Column
          title='一级评论人'
          dataIndex='parent'
          key='parent'
          width={200}
          render={(parent: IComment) => (
            <span>
              {parent?.createBy.nickName ?? '无'}
            </span>
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
              <Button type='primary'
                      onClick={() => changeCommentsAuditStatus(comment.id, 1)}>同意</Button>
              <Button type='primary' danger
                      onClick={() => changeCommentsAuditStatus(comment.id, 2)}>驳回</Button>
            </Space>
          )}
        />
      </Table>
    </div>
  );
};
export default Comment;
