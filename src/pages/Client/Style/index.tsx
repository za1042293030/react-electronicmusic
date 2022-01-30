import { IRouterProps, ISongSimple } from '@/common/typings';
import { IPlayListSimple, IStyle } from '@/common/typings/service';
import { RoutingGuard, If, Loading } from '@/components';
import { useSetTitle, useUserInfo } from '@/hooks';
import api from '@/services';
import { Button, Pagination } from 'antd';
import React, { createContext, FC, ReactElement, useCallback, useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import TagGroup from './components/TagGroup';
import './index.less';
export const StyleContext = createContext<ISongSimple[] | IPlayListSimple[]>([]);

enum RouterName {
  SONG = 'song',
  PLAYLIST = 'playlist',
}

interface IState {
  tags: IStyle[];
  list: ISongSimple[] | IPlayListSimple[];
  subTags: IStyle[];
  loading: boolean;
  chooseId: number;
  router: RouterName | null;
  totalCount: number;
  pageCurrent: number;
}
const pageSize = 24;

const Style: FC<IRouterProps> = ({ route, location: { pathname } }): ReactElement => {
  useSetTitle(route.meta?.title!);

  const [state, setState] = useState<IState>({
    tags: [],
    list: [],
    subTags: [],
    loading: true,
    chooseId: -1,
    router: null,
    totalCount: 0,
    pageCurrent: 1,
  });
  const { isLogin } = useUserInfo();

  useEffect(() => {
    let router: RouterName;
    if (pathname.includes('songs')) {
      router = RouterName.SONG;
    } else if (pathname.includes('playlists')) {
      router = RouterName.PLAYLIST;
    } else return;
    setState(state => ({
      ...state,
      router,
    }));
  }, [pathname]);

  useEffect(() => {
    (async () => {
      setState(state => ({
        ...state,
        loading: true,
      }));
      let apiFn;
      switch (state.router) {
        case RouterName.SONG: {
          apiFn = api.getRecommendSongs(pageSize, true);
          break;
        }
        case RouterName.PLAYLIST: {
          apiFn = api.getRecommendPlayLists(pageSize);
          break;
        }
        default:
          break;
      }
      const list = await apiFn;
      setState(state => ({
        ...state,
        list: (list as ISongSimple[]) ?? [],
        loading: false,
      }));
    })();
  }, [state.router]);

  useEffect(() => {
    (async () => {
      const styles = await api.getAllStyles();
      if (styles) {
        setState(state => ({
          ...state,
          subTags: styles[0]?.children,
          tags: styles,
          loading: false,
        }));
      }
    })();
  }, []);

  const onChange = useCallback(
    async (tag: IStyle) => {
      setState(state => ({
        ...state,
        loading: true,
        chooseId: tag.id,
        pageCurrent: 1,
      }));
      let apiFn;
      switch (state.router) {
        case RouterName.SONG: {
          apiFn = api.getSongsByStyleId(tag.id, 1, pageSize);
          break;
        }
        case RouterName.PLAYLIST: {
          apiFn = api.getPlayListsByStyleId(tag.id, 1, pageSize);
          break;
        }
        default:
          break;
      }
      const res = await apiFn;
      setState(state => ({
        ...state,
        list: ((res?.songs as ISongSimple[]) || (res?.playLists as IPlayListSimple[])) ?? [],
        totalCount: res?.totalCount ?? 0,
        loading: false,
      }));
    },
    [state.tags, state.subTags]
  );

  const onMouseEnter = useCallback((tag: IStyle) => {
    setState(state => ({
      ...state,
      subTags: tag.children,
    }));
  }, []);

  const linkClick = async (router: RouterName) => {
    setState(state => ({
      ...state,
      chooseId: -1,
      router,
    }));
  };

  const onPageChange = async (page: number) => {
    window.scrollTo(0, 0);
    setState(state => ({
      ...state,
      loading: true,
      pageCurrent: page,
    }));
    const res = await api.getSongsByStyleId(state.chooseId, page, pageSize);
    if (res)
      setState(state => ({
        ...state,
        list: res.songs as ISongSimple[],
        totalCount: res.totalCount,
        loading: false,
      }));
  };

  return (
    <div className="style">
      <main className="main">
        <div className="tag-nav transition-2">
          <div className="tag-nav-container transition-2">
            <TagGroup
              tags={state.tags}
              onChange={onChange}
              onMouseEnter={onMouseEnter}
              chooseId={state.chooseId}
            />
            <TagGroup tags={state.subTags} onChange={onChange} chooseId={state.chooseId} />
          </div>
          <div className="tag-links">
            <NavLink
              activeClassName="ant-tag-checkable-checked"
              to="/client/style/songs"
              className="ant-tag ant-tag-checkable"
              onClick={() => linkClick(RouterName.SONG)}
            >
              音乐
            </NavLink>
            <NavLink
              activeClassName="ant-tag-checkable-checked"
              to="/client/style/playlists"
              className="ant-tag ant-tag-checkable"
              onClick={() => linkClick(RouterName.PLAYLIST)}
            >
              歌单
            </NavLink>
          </div>
        </div>
        <div className="list transition-2">
          <If
            flag={state.loading}
            element1={<Loading />}
            element2={
              <>
                <StyleContext.Provider value={state.list}>
                  <RoutingGuard routerConfig={route.children!} />
                </StyleContext.Provider>
                <If
                  flag={state.chooseId !== -1 && isLogin && state.totalCount !== 0}
                  element1={
                    <Pagination
                      className="style-pagination"
                      total={state.totalCount}
                      pageSize={pageSize}
                      showSizeChanger={false}
                      showQuickJumper={{ goButton: <Button>确认</Button> }}
                      onChange={onPageChange}
                      current={state.pageCurrent}
                    />
                  }
                />
              </>
            }
          />
        </div>
      </main>
    </div>
  );
};
export default Style;
