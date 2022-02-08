import { IPlayListSimple, IRouterProps, IStyle } from '@/common/typings';
import { MusicCard, For, If, Empty } from '@/components';
import { useHistoryScroll, useSetTitle } from '@/hooks';
import { Tag } from 'antd';
import React, { FC, ReactElement, useCallback, useContext } from 'react';
import { StyleContext } from '..';
import './index.less';
import DedaultImg from '@/assets/emptyImg.webp';

const Playlists: FC<IRouterProps> = ({ route }): ReactElement => {
  useSetTitle(route.meta?.title);
  const { push } = useHistoryScroll();
  const list = useContext(StyleContext);
  const forChildren = useCallback(
    (playList: IPlayListSimple) => (
      <div className="col-container" key={playList.id}>
        <MusicCard
          src={playList.cover ?? DedaultImg}
          row
          height={12}
          onClick={() => {
            push('/client/playlist/' + playList.id);
          }}
          playBtn={false}
        >
          <div
            className="playlist-card-bottom"
            onClick={() => {
              push('/client/playlist/' + playList.id);
            }}
          >
            <div className="playlist-tag-container">
              <For data={playList.styles} emptyEl={false}>
                {(style: IStyle) => (
                  <>
                    <Tag key={style.id} className="playlist-tag">
                      {style.name}
                    </Tag>
                  </>
                )}
              </For>
            </div>
            <div className="card-info">
              <span>{playList.name}</span>
              <span className="song-name">By {playList.createBy?.nickName}</span>
            </div>
          </div>
        </MusicCard>
      </div>
    ),
    []
  );
  return (
    <div className="playlist">
      <If
        flag={list.length === 0}
        element1={<Empty />}
        element2={<For data={list}>{forChildren}</For>}
      />
    </div>
  );
};
export default Playlists;
