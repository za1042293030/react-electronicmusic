import { SM_CWIDTH } from '@/common/constants';
import {
  IDynamic,
  IParams,
  IPlayListSimple,
  IRouterProps,
  IStyle,
  IUserInfo,
} from '@/common/typings';
import { Avatar, DynamicCard, Empty, For, If, Loading, MusicCard } from '@/components';
import { usePlayList, useSetTitle, useUserInfo } from '@/hooks';
import api from '@/services';
import { Affix, Button, Skeleton, Tabs, Tag } from 'antd';
import { isEmpty } from 'lodash';
import React, { FC, ReactElement, useCallback, useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useHistory } from 'react-router-dom';
import './index.less';
import DedaultImg from '@/assets/emptyImg.webp';

const { TabPane } = Tabs;

enum TabKey {
  MESSAGE = 'message',
  ALBUM = 'album',
  PLAYLIST = 'playlist',
  ARTIST = 'artist',
  DYNAMIC = 'dynamic',
}

interface IState {
  userInfo: IUserInfo | Record<string, any>;
  dynamics: IDynamic[];
  playlists: IPlayListSimple[];
  hasMore: boolean;
  id: number;
  pageSize: number;
  tabKey: TabKey;
  tabPosition: 'left' | 'top';
  useInfoLoading: boolean;
  pageIndex: number;
}

const PersonalCenter: FC<IRouterProps<IParams>> = ({
  route,
  match: {
    params: { id: _id },
  },
}): ReactElement => {
  useSetTitle(route.meta?.title!);
  const cWidth = document.documentElement.clientWidth;
  const { userInfo: _userInfo } = useUserInfo();
  const [
    {
      userInfo,
      dynamics,
      hasMore,
      id,
      pageSize,
      tabKey,
      tabPosition,
      useInfoLoading,
      playlists,
      pageIndex,
    },
    setState,
  ] = useState<IState>({
    useInfoLoading: false,
    userInfo: _userInfo.id == _id ? _userInfo : {},
    dynamics: [],
    playlists: [],
    hasMore: true,
    id: parseInt(_id),
    pageSize: 10,
    tabKey: _userInfo.id == _id ? TabKey.MESSAGE : TabKey.DYNAMIC,
    tabPosition: cWidth > SM_CWIDTH ? 'left' : 'top',
    pageIndex: 1,
  });
  const history = useHistory();
  const { addPlayList } = usePlayList();

  const onChange = useCallback((key: string) => {
    setState(state => ({
      ...state,
      tabKey: key as TabKey,
    }));
  }, []);

  useEffect(() => {
    let data: IDynamic[] | IPlayListSimple[];
    if (!isEmpty(dynamics)) data = dynamics;
    else if (!isEmpty(playlists)) data = playlists;
    else return;
    if (tabKey === TabKey.PLAYLIST && pageIndex === 2 && data.length < 10)
      setState(state => ({
        ...state,
        hasMore: false,
      }));
  }, [playlists, dynamics]);

  useEffect(() => {
    setState(state => ({
      ...state,
      hasMore: true,
      dynamics: [],
      playlists: [],
      pageIndex: 1,
    }));
    switch (tabKey) {
      case TabKey.DYNAMIC: {
        loadDynamicsData(1);
        break;
      }
      case TabKey.PLAYLIST: {
        loadPlayListData(1);
        break;
      }
      default:
        break;
    }
  }, [tabKey]);

  useEffect(() => {
    (async () => {
      if (!isEmpty(userInfo) || isNaN(id)) return;
      setState(state => ({
        ...state,
        useInfoLoading: true,
      }));
      const userInfoMsg = await api.getUserInfo(id);
      setState(state => ({
        ...state,
        userInfo: userInfoMsg ?? {},
        useInfoLoading: false,
      }));
    })();
  }, []);

  const loadDynamicsData = useCallback(
    async (pageIn?: number) => {
      setState(state => ({
        ...state,
        loading: true,
      }));
      const newDynamics = await api.getDynamicByUserId(id, pageSize, pageIn ?? pageIndex);
      const empty = isEmpty(newDynamics);
      setState(state => ({
        ...state,
        hasMore: empty ? false : true,
        dynamics: [...state.dynamics, ...(!empty ? (newDynamics as IDynamic[]) : [])],
        loading: false,
        pageIndex: empty ? state.pageIndex : state.pageIndex + 1,
      }));
    },
    [id, pageIndex, pageSize]
  );

  const loadPlayListData = useCallback(
    async (pageIn?: number) => {
      setState(state => ({
        ...state,
        loading: true,
      }));
      const newPlayLists = await api.getPlayListsByUserId(id, pageIn ?? pageIndex, pageSize);
      const empty = isEmpty(newPlayLists);
      setState(state => ({
        ...state,
        hasMore: empty ? false : true,
        playlists: [...state.playlists, ...(!empty ? (newPlayLists as IPlayListSimple[]) : [])],
        loading: false,
        pageIndex: empty ? state.pageIndex : state.pageIndex + 1,
      }));
    },
    [id, pageIndex, pageSize]
  );

  const onComment = useCallback((id: number) => {
    history.push('/client/dynamic/' + id);
  }, []);

  return (
    <div className="personal-center">
      <main className="main">
        <div className="personal-center-container">
          <If
            flag={useInfoLoading}
            element1={<Loading />}
            element2={
              <Affix offsetTop={document.documentElement.clientWidth > SM_CWIDTH ? 60 : 50}>
                <div className="personal-info">
                  <div className="personal-info-avatar">
                    <Avatar imgSrc={userInfo.avatar} size={5} />
                  </div>
                  <p className="personal-name">{userInfo.nickName}</p>
                  <div className="personal-info-follow">
                    <div className="personal-info-follow-text">
                      <p>
                        关注数 <span>0</span>
                      </p>
                      <p>
                        粉丝数 <span>0</span>
                      </p>
                    </div>
                    <If
                      flag={_userInfo.id !== id}
                      element1={
                        <div className="personal-info-follow-btn">
                          <Button type="primary">关注</Button>
                        </div>
                      }
                    />
                  </div>
                </div>
              </Affix>
            }
          />
          <Tabs
            defaultActiveKey="1"
            onChange={onChange}
            tabPosition={tabPosition}
            className="personal-tabs"
          >
            {_userInfo.id === id ? (
              <TabPane tab="资料" key="message">
                Content of Tab Pane 2
              </TabPane>
            ) : null}
            <TabPane tab="动态" key="dynamic">
              <If
                flag={tabKey === TabKey.DYNAMIC}
                element1={
                  <InfiniteScroll
                    dataLength={dynamics.length}
                    next={loadDynamicsData}
                    hasMore={hasMore}
                    loader={<Skeleton avatar active />}
                    endMessage={<Empty text="暂无更多..." />}
                  >
                    <For data={dynamics}>
                      {(dynamic: IDynamic) => (
                        <DynamicCard
                          onComment={onComment}
                          // onLike={onLike}
                          onClickSong={addPlayList}
                          {...dynamic}
                          key={dynamic.id}
                        />
                      )}
                    </For>
                  </InfiniteScroll>
                }
              />
            </TabPane>
            <TabPane tab="歌单" key="playlist">
              <If
                flag={tabKey === TabKey.PLAYLIST}
                element1={
                  <InfiniteScroll
                    dataLength={playlists.length}
                    next={loadPlayListData}
                    hasMore={hasMore}
                    loader={<Skeleton active />}
                    endMessage={<Empty text="暂无更多..." />}
                  >
                    <For data={playlists}>
                      {(playList: IPlayListSimple) => (
                        <div className="col-container" key={playList.id}>
                          <MusicCard
                            src={playList.cover ?? DedaultImg}
                            row
                            height={12}
                            playBtn={false}
                          >
                            <div
                              className="playlist-card-bottom"
                              onClick={() => {
                                history.push('/client/playlist/' + playList.id);
                              }}
                            >
                              <span className="card-info">{playList.name}</span>
                              <div className="playlist-tag-container">
                                <For data={playList.styles}>
                                  {(style: IStyle) => (
                                    <Tag key={style.id} className="playlist-tag">
                                      {style.name}
                                    </Tag>
                                  )}
                                </For>
                              </div>
                            </div>
                          </MusicCard>
                        </div>
                      )}
                    </For>
                  </InfiniteScroll>
                }
              />
            </TabPane>
            {userInfo.role?.id === 2 ? (
              <TabPane tab="专辑" key="album">
                Content of Tab Pane 2
              </TabPane>
            ) : null}
            {_userInfo.id === id && userInfo.role?.id === 2 ? (
              <TabPane tab="制作人" key="artist">
                Content of Tab Pane 2
              </TabPane>
            ) : null}
          </Tabs>
        </div>
      </main>
    </div>
  );
};
export default PersonalCenter;
