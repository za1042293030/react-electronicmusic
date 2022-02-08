import { XS_CWIDTH } from '@/common/constants';
import { IUserSimple, ISearchSong, IStyle } from '@/common/typings';
import { For, If } from '@/components';
import { useHistoryScroll, usePlayList } from '@/hooks';
import { PlayCircleOutlined } from '@ant-design/icons';
import { Table, Tag } from 'antd';
import React, { FC, ReactElement, useContext, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { SearchContext } from '..';
const { Column } = Table;

const Song: FC = (): ReactElement => {
  const location = useLocation();
  const { data, total, loading, onChange, getKey } = useContext(SearchContext);
  const { addPlayList } = usePlayList();
  const cWidth = document.documentElement.clientWidth;
  const { push } = useHistoryScroll();

  const onPlay = (value: ISearchSong) => {
    addPlayList(value);
  };

  useEffect(() => {
    getKey && getKey(location.search);
  }, [location.search]);

  return (
    <Table
      rowKey="id"
      dataSource={data as ISearchSong[]}
      pagination={{ pageSize: 20, position: ['bottomCenter'], total, showSizeChanger: false }}
      size={cWidth > XS_CWIDTH ? 'middle' : 'small'}
      loading={loading}
      onChange={({ current }) => onChange && onChange(current!)}
    >
      <Column
        width={40}
        render={value => (
          <PlayCircleOutlined
            style={{ fontSize: '2rem', cursor: 'pointer' }}
            onClick={() => onPlay(value)}
          />
        )}
        key="play"
      />
      <Column
        title="名字"
        dataIndex="name"
        key="name"
        colSpan={cWidth > XS_CWIDTH ? 1 : 2}
        render={(name, song: ISearchSong) => (
          <span
            className="pointer"
            onClick={() => {
              push('/client/song/' + song.id);
            }}
          >
            {name}
          </span>
        )}
      />
      <Column
        title="专辑"
        dataIndex="album"
        key="album"
        colSpan={cWidth > XS_CWIDTH ? 1 : 0}
        render={album => (
          <If
            flag={cWidth > XS_CWIDTH}
            element1={
              <span
                className="pointer"
                onClick={() => {
                  push('/client/album/' + album.id);
                }}
              >
                {album.name}
              </span>
            }
          />
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
export default Song;
