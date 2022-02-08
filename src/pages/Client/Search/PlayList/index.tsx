import { XS_CWIDTH } from '@/common/constants';
import { IUserSimple, IStyle, ISearchPlayList } from '@/common/typings';
import { For, If, LazyLoad, Loading } from '@/components';
import { useHistoryScroll } from '@/hooks';
import { Table, Tag } from 'antd';
import React, { FC, ReactElement, useContext, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { SearchContext } from '..';
const { Column } = Table;

const PlayList: FC = (): ReactElement => {
  const location = useLocation();
  const { data, total, loading, onChange, getKey } = useContext(SearchContext);
  const cWidth = document.documentElement.clientWidth;
  const { push } = useHistoryScroll();

  useEffect(() => {
    getKey && getKey(location.search);
  }, [location.search]);

  const goToPlayList = (id: number) => {
    if (!id) return;
    push('/client/playlist/' + id);
  };

  return (
    <Table
      rowKey="id"
      dataSource={data as ISearchPlayList[]}
      pagination={{ pageSize: 20, position: ['bottomCenter'], total, showSizeChanger: false }}
      size={cWidth > XS_CWIDTH ? 'middle' : 'small'}
      loading={loading}
      onChange={({ current }) => onChange && onChange(current!)}
    >
      <Column
        dataIndex="cover"
        key="cover"
        width={100}
        render={(cover: string, { id }: ISearchPlayList) => (
          <LazyLoad loading={<Loading width={8} height={8} />}>
            <img src={cover} title={cover} className="album-pic" onClick={() => goToPlayList(id)} />
          </LazyLoad>
        )}
      />
      <Column
        title="名字"
        dataIndex="name"
        key="name"
        render={(name, { id }: ISearchPlayList) => (
          <span className="pointer" onClick={() => goToPlayList(id)}>
            {name}
          </span>
        )}
      />
      <Column
        title="风格"
        dataIndex="styles"
        key="styles"
        colSpan={cWidth > XS_CWIDTH ? 1 : 0}
        render={(styles: IStyle[]) => (
          <If
            flag={cWidth > XS_CWIDTH}
            element1={<For data={styles}>{style => <Tag key={style.id}>{style.name}</Tag>}</For>}
          />
        )}
      />
      <Column
        title="创建者"
        dataIndex="createBy"
        key="createBy"
        colSpan={cWidth > XS_CWIDTH ? 1 : 2}
        render={(createBy: IUserSimple) => (
          <>
            <span
              className="pointer"
              onClick={() => {
                push('/client/personalcenter/' + createBy.id);
              }}
            >
              {createBy.nickName}
            </span>
          </>
        )}
      />
    </Table>
  );
};
export default PlayList;
