import { IRouterProps, ISearchAlbum } from '@/common/typings';
import { MusicCard, For, If, Loading, Empty } from '@/components';
import { useSetTitle } from '@/hooks';
import api from '@/services';
import { Tag } from 'antd';
import { isEmpty } from 'lodash';
import React, { FC, ReactElement, useCallback, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
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
  const history = useHistory();

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
    history.push('/client/album/' + id);
  }, []);

  const forChildren = useCallback(
    (album: ISearchAlbum) => (
      <div className="col-container" key={album.id}>
        <MusicCard src={album.cover} playBtn={false} onClick={() => goToAlbum(album.id)}>
          <div className="song-card-bottom">
            <div className="song-tag-container">
              <div className="song-tag-container-inline">
                <For data={album.styles}>{style => <Tag key={style.id}>{style.name}</Tag>}</For>
              </div>
            </div>
            <div className="card-info">
              <p className="song-name">{album.name}</p>
              <p className="song-producers">
                {album.artists.map(artist => artist.nickName).join(',')}
              </p>
            </div>
          </div>
        </MusicCard>
      </div>
    ),
    []
  );
  return (
    <div className="album">
      <main className="main">
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
