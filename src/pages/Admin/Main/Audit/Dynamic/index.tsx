import {
  IDynamic,
  IDynamicPic, IDynamicSong,
  IRouterProps,
  IUserSimple,
} from '@/common/typings';
import { useSetTitle } from '@/hooks';
import React, { FC, ReactElement, useEffect, useState } from 'react';
import { For, If } from '@/components';
import { Image, Space, Table } from 'antd';
import api from '@/services';
import { isEmpty } from 'lodash';
import moment from 'moment';

const { Column } = Table;

interface IState {
  loading: boolean;
  total: number;
  data: IDynamic[];
  pageIndex: number;
  pageSize: number;
}

const Dynamic: FC<IRouterProps> = ({ route }): ReactElement => {
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
    const res = await api.admin.getApprovingDynamics(pageIndex, pageSize);
    if (!res) return;
    setState(state => ({
      ...state,
      data: !res || isEmpty(res?.data) ? [] : ((res.data as IDynamic[]).map(item => ({
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

  const changeDynamicsAuditStatus = async (id: number, status: number) => {
    await api.admin.changeDynamicsAuditStatus(id, status);
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
          title='歌曲'
          dataIndex='song'
          key='song'
          render={(song: IDynamicSong) => (
            <span>
              {song?.name ?? '无'}
            </span>
          )}
        />
        <Column
          title='图片相册'
          dataIndex='pictures'
          key='pictures'
          width={200}
          render={(pictures, dynamic: IDynamic) => (
            <If flag={isEmpty(pictures)} element1='无' element2={
              <>
                <div style={{
                  maxHeight: '20rem',
                  overflow: 'hidden',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                  <Image
                    preview={{ visible: false }}
                    width={200}
                    src={!isEmpty(pictures) && pictures[0].src}
                    onClick={() => setState(state => ({
                      ...state,
                      data: state.data.map(item => ({
                        ...item,
                        visible: dynamic.id === item.id,
                      })),
                    }))}
                  />
                </div>
                <div style={{ display: 'none' }}>
                  <Image.PreviewGroup
                    preview={{
                      visible: dynamic.visible, onVisibleChange: () => setState(state => ({
                        ...state,
                        data: state.data.map(item => ({
                          ...item,
                          visible: false,
                        })),
                      })),
                    }}>
                    <For data={pictures} emptyEl={false}>
                      {
                        (picture: IDynamicPic) => (
                          <Image
                            preview={{ visible: false }}
                            width={150}
                            src={picture.src}
                          />
                        )
                      }
                    </For>
                  </Image.PreviewGroup>
                </div>
              </>
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
          render={(_r, dynamic: IDynamic) => (
            <Space>
              <a onClick={() => changeDynamicsAuditStatus(dynamic.id, 1)}>同意</a>
              <a style={{ color: '#ff0000' }}
                 onClick={() => changeDynamicsAuditStatus(dynamic.id, 2)}>驳回</a>
            </Space>
          )}
        />
      </Table>
    </div>
  );
};
export default Dynamic;
