import { XS_CWIDTH } from '@/common/constants/clientwidth';
import { IRouterProps, ISongSimple } from '@/common/typings';
import { MusicCard, For, If, Empty } from '@/components';
import { useHistoryScroll, usePlayList, useSetTitle } from '@/hooks';
import { Tag, Tooltip } from 'antd';
import React, { FC, ReactElement, useCallback } from 'react';
import { useContext } from 'react';
import { StyleContext } from '..';
import './index.less';

const Songs: FC<IRouterProps> = ({ route }): ReactElement => {
  useSetTitle(route.meta?.title);

  const list = useContext(StyleContext);
  const cWidth = document.documentElement.clientWidth;
  const { addPlayList } = usePlayList();
  const { push } = useHistoryScroll();

  const forChildren = useCallback(
    (song: ISongSimple) => (
      <div className='col-container' key={song.id}>
        <MusicCard
          src={song.cover}
          imgWidth={cWidth < XS_CWIDTH ? 6 : undefined}
          row={cWidth < XS_CWIDTH}
          height={cWidth < XS_CWIDTH ? 6 : undefined}
          onClick={() => addPlayList(song)}
          fileSrc={song.file}
        >
          <div
            className='song-card-bottom'
            title='点击前往歌曲详情页'
            onClick={() => {
              push('/client/song/' + song.id);
            }}
          >
            <div className='song-tag-container'>
              <div className='song-tag-container-inline'>
                <For data={song.styles}>{style => <Tag key={style.id}>{style.name}</Tag>}</For>
              </div>
            </div>

            <div className='card-info'>
              <Tooltip
                title={song.name}>
                <p className='song-name'>{song.name}</p>
              </Tooltip>
              <Tooltip
                title={song.artists?.map(artist => artist.nickName).join(',')}>
                <p className='song-producers'>
                  {song.artists?.map(artist => artist.nickName).join(',')}
                </p>
              </Tooltip>
            </div>
          </div>
        </MusicCard>
      </div>
    ),
    [],
  );
  return (
    <div className='song'>
      <If
        flag={list.length === 0}
        element1={<Empty />}
        element2={<For data={list}>{forChildren}</For>}
      />
    </div>
  );
};
export default Songs;
