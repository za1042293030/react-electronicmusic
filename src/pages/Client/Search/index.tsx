import {
  IPage,
  IRouterProps,
  ISearchAlbum,
  ISearchPlayList,
  ISearchSong,
  ISearchUser,
} from '@/common/typings';
import { useSetTitle } from '@/hooks';
import { Affix, Menu } from 'antd';
import React, {
  createContext,
  FC,
  Key,
  ReactElement,
  useCallback,
  useEffect,
  useState,
} from 'react';
import api from '@/services';
import { isEmpty } from 'lodash';
import './index.less';
import { parse } from 'querystring';
import { SM_CWIDTH, XS_CWIDTH } from '@/common/constants';
import { If, RoutingGuard, SearchInput } from '@/components';

interface IContext {
  data: ISearchSong[] | ISearchAlbum[] | ISearchUser[] | ISearchPlayList[];
  total: number;
  loading: boolean;
  onChange?: (current: number) => void;
  getKey?: (search: string) => void;
}

export const SearchContext = createContext<IContext>({
  data: [],
  total: 0,
  loading: false,
});

type SearchType = 'song' | 'album' | 'playlist' | 'user' | 'artist';

interface IState {
  data: ISearchSong[];
  searchType: SearchType;
  loading: boolean;
  total: number;
  pageSize: number;
  pageIndex: number;
  key: string;
}

const Search: FC<IRouterProps> = ({ route, location: { search }, history }): ReactElement => {
  useSetTitle(route.meta?.title);
  const [{ data, searchType, loading, total, pageSize, pageIndex, key }, setState] =
    useState<IState>({
      data: [],
      searchType: 'song',
      loading: false,
      total: 0,
      pageSize: 20,
      pageIndex: 1,
      key: parse(search)['?key'] as string,
    });

  const onSelect = useCallback(({ key }: { key: Key }) => {
    setState(state => ({
      ...state,
      searchType: key as SearchType,
    }));
  }, []);

  const onChange = (current: number) => {
    setState(state => ({
      ...state,
      pageIndex: current,
    }));
  };

  const getKey = (search: string) => {
    setState(state => ({
      ...state,
      key: parse(search)['?key'] as string,
    }));
  };

  const loadData = async () => {
    setState(state => ({
      ...state,
      loading: true,
      data: [],
      total: 0,
    }));
    let res: IPage<ISearchSong | ISearchAlbum | ISearchUser | ISearchPlayList> | undefined | null;
    switch (searchType) {
      case 'song': {
        res = await api.searchSongs(key, pageIndex, pageSize);
        break;
      }
      case 'album': {
        res = await api.searchAlbums(key, pageIndex, pageSize);
        break;
      }
      case 'playlist': {
        res = await api.searchPlayLists(key, pageIndex, pageSize);
        break;
      }
      case 'user': {
        res = await api.searchUsers(key, pageIndex, pageSize);
        break;
      }
      case 'artist': {
        res = await api.searchArtists(key, pageIndex, pageSize);
        break;
      }
      default:
        break;
    }
    setState(state => ({
      ...state,
      loading: false,
      data: !res || isEmpty(res?.data) ? [] : (res.data as ISearchSong[]),
      total: res ? res.totalCount : 0,
    }));
  };

  useEffect(() => {
    setState(state => ({
      ...state,
      pageIndex: 1,
      data: [],
      total: 0,
    }));
    history.push('/client/search/' + searchType + (key ? '?key=' + key : ''));
  }, [searchType]);

  useEffect(() => {
    loadData();
    window.scrollTo(0, 0);
  }, [searchType, key, pageIndex]);

  const cWidth = document.documentElement.clientWidth;

  const onSearch = useCallback((value: string) => {
    if (value.trim() === '') return;
    setState(state => ({
      ...state,
      key: value,
    }));
  }, []);

  return (
    <div className="search">
      <main className="main">
        <div className="search-container">
          <Affix offsetTop={cWidth > SM_CWIDTH ? 60 : 50}>
            <If
              flag={cWidth > XS_CWIDTH}
              element2={
                <div className="search-container-input">
                  <SearchInput placeholder="搜索..." onSearch={onSearch} />
                </div>
              }
            />
            <Menu mode="horizontal" defaultSelectedKeys={[searchType]} onSelect={onSelect}>
              <Menu.Item key="song">
                <a>歌曲</a>
              </Menu.Item>
              <Menu.Item key="album">
                <a>专辑</a>
              </Menu.Item>
              <Menu.Item key="playlist">
                <a>歌单</a>
              </Menu.Item>
              <Menu.Item key="user">
                <a>用户</a>
              </Menu.Item>
              <Menu.Item key="artist">
                <a>制作人</a>
              </Menu.Item>
            </Menu>
          </Affix>
          <SearchContext.Provider
            value={{
              data,
              total,
              loading,
              onChange,
              getKey,
            }}
          >
            <RoutingGuard routerConfig={route.children!} />
          </SearchContext.Provider>
        </div>
      </main>
    </div>
  );
};
export default Search;
