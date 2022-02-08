import { XS_CWIDTH } from '@/common/constants';
import { IUserSimple, ISearchAlbum, IStyle } from '@/common/typings';
import { For, If, LazyLoad, Loading } from '@/components';
import { useHistoryScroll } from '@/hooks';
import { Table, Tag } from 'antd';
import React, { FC, ReactElement, useContext, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { SearchContext } from '..';
const { Column } = Table;

const Album: FC = (): ReactElement => {
  const location = useLocation();
  const { data, total, loading, onChange, getKey } = useContext(SearchContext);
  const cWidth = document.documentElement.clientWidth;
  const { push } = useHistoryScroll();

  useEffect(() => {
    getKey && getKey(location.search);
  }, [location.search]);

  const goToAlbum = (id: number) => {
    if (!id) return;
    push('/client/album/' + id);
  };

  return (
    <Table
      rowKey="id"
      dataSource={data as ISearchAlbum[]}
      pagination={{ pageSize: 20, position: ['bottomCenter'], total, showSizeChanger: false }}
      size={cWidth > XS_CWIDTH ? 'middle' : 'small'}
      loading={loading}
      onChange={({ current }) => onChange && onChange(current!)}
    >
      <Column
        dataIndex="cover"
        key="cover"
        width={100}
        render={(cover: string, { id }: ISearchAlbum) => (
          <LazyLoad loading={<Loading width={8} height={8} />}>
            <img src={cover} title={cover} className="album-pic" onClick={() => goToAlbum(id)} />
          </LazyLoad>
        )}
      />
      <Column
        title="名字"
        dataIndex="name"
        key="name"
        render={(name, { id }: ISearchAlbum) => (
          <span className="pointer" onClick={() => goToAlbum(id)}>
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
        title="制作人"
        dataIndex="artists"
        key="artists"
        colSpan={cWidth > XS_CWIDTH ? 1 : 2}
        render={(artists: IUserSimple[]) => (
          <For data={artists}>
            {(artist: IUserSimple, index) => (
              <span
                key={artist.id}
                className="pointer"
                onClick={() => {
                  push('/client/personalcenter/' + artist.id);
                }}
              >
                {artist.nickName}
                {index === artists.length - 1 ? null : ','}
              </span>
            )}
          </For>
        )}
      />
    </Table>
  );
};
export default Album;
