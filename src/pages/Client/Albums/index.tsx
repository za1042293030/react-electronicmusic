import { IRouterProps, ISearchAlbum } from '@/common/typings';
import { MusicCard, For, If, Loading, Empty } from '@/components';
import { useHistoryScroll, useSetTitle } from '@/hooks';
import api from '@/services';
import { Tag, Tooltip } from 'antd';
import { isEmpty } from 'lodash';
import React, { FC, ReactElement, useCallback, useEffect, useState } from 'react';
import './index.less';

interface IState {
  loading: boolean;
  list: ISearchAlbum[];
}

const Albums: FC<IRouterProps> = ({ route }): ReactElement => {
  useSetTitle(route.meta?.title);
  const [{ list, loading }, setState] = useState<IState>({
    loading: false,
    list: [],
  });
  const { push } = useHistoryScroll();

  useEffect(() => {
    (async () => {
      setState(state => ({
        ...state,
        loading: true,
      }));
      const list = await api.getRecommendAlbums(40);
      setState(state => ({
        ...state,
        loading: false,
        list: list ?? [],
      }));
    })();
  }, []);

  const goToAlbum = useCallback((id: number) => {
    if (!id) return;
    window.scrollTo(0, 0);
    push('/client/album/' + id);
  }, []);

  const forChildren = useCallback(
    (album: ISearchAlbum) => (
      <div className='col-container' key={album.id}>
        <MusicCard src={album.cover} playBtn={false} onClick={() => goToAlbum(album.id)} className="album-card">
          <div className='song-card-bottom'>
            <div className='song-tag-container'>
              <div className='song-tag-container-inline'>
                <For data={album.styles}>{style => <Tag key={style.id}>{style.name}</Tag>}</For>
              </div>
            </div>
            <div className='card-info'>
              <Tooltip
                placement="topLeft"
                title={album.name}>
                <p className='song-name'>{album.name}</p>
              </Tooltip>
              <Tooltip
                placement="topLeft"
                title={album.artists.map(artist => artist.nickName).join(',')}>
                <p className='song-producers'>
                  {album.artists.map(artist => artist.nickName).join(',')}
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
    <div className='album'>
      <main className='main'>
        <If
          flag={loading}
          element1={<Loading />}
          element2={
            <If
              flag={!loading && isEmpty(list)}
              element1={<Empty />}
              element2={<For data={list}>{forChildren}</For>}
            />
          }
        />
      </main>
    </div>
  );
};

/* <CSSTransition
      timeout={500}
      classNames="route"
      key={location.pathname}
      in={match != null}
      unmountOnExit
    > */
export default Albums;
