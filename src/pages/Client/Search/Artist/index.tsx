import { XS_CWIDTH } from '@/common/constants';
import { ISearchUser } from '@/common/typings';
import { Table } from 'antd';
import React, { FC, ReactElement, useContext, useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { SearchContext } from '..';
import { Avatar, LazyLoad, Loading } from '@/components';

const { Column } = Table;

const Artist: FC = (): ReactElement => {
  const location = useLocation();
  const { data, total, loading, onChange, getKey } = useContext(SearchContext);
  const cWidth = document.documentElement.clientWidth;
  const history = useHistory();

  useEffect(() => {
    getKey && getKey(location.search);
  }, [location.search]);

  const goToPersonalCenter = (id: number) => {
    if (!id) return;
    history.push('/client/personalcenter/' + id);
  };

  return (
    <Table
      dataSource={data as ISearchUser[]}
      pagination={{ pageSize: 20, position: ['bottomCenter'], total, showSizeChanger: false }}
      size={cWidth > XS_CWIDTH ? 'middle' : 'small'}
      loading={loading}
      onChange={({ current }) => onChange && onChange(current!)}
    >
      <Column
        dataIndex="avatar"
        key="avatar"
        width={80}
        render={(avatar: string, { id }: ISearchUser) => (
          <LazyLoad loading={<Loading width={6} height={6} />}>
            <Avatar
              imgSrc={avatar}
              onClick={() => goToPersonalCenter(id)}
              size={6.4}
            />
          </LazyLoad>
        )}
      />
      <Column
        title="昵称"
        dataIndex="nickName"
        key="nickName"
        render={(name, { id }: ISearchUser) => (
          <span className="pointer" onClick={() => goToPersonalCenter(id)}>
            {name}
          </span>
        )}
      />
    </Table>
  );
};
export default Artist;
