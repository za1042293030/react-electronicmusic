import { SM_CWIDTH } from '@/common/constants/clientwidth';
import { IDynamic, IRouterProps, IStoreState } from '@/common/typings';
import { Empty, Footer, For, If } from '@/components';
import { usePlayList, useSetTitle } from '@/hooks';
import { Affix, Menu, Skeleton } from 'antd';
import React, { FC, ReactElement, useCallback, useEffect, useMemo, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { DynamicCard } from '@/components';
import DynamicForm from './components/DynamicForm';
import './index.less';
import { useSelector } from 'react-redux';
import { isEmpty } from 'lodash';
import api from '@/services';
import { useRef } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';

type Type = 'Recommend' | 'Latest' | 'Followed';
interface IState {
  dynamics: IDynamic[];
  sideMode: 'inline' | 'horizontal';
  hasMore: boolean;
  firstTime: boolean;
}
const pageSize = 10;

const Dynamics: FC<IRouterProps> = ({ route }): ReactElement => {
  useSetTitle(route.meta?.title!);

  const [{ dynamics, sideMode, hasMore, firstTime }, setState] = useState<IState>({
    dynamics: [],
    sideMode: 'inline',
    hasMore: true,
    firstTime: true,
  });
  const pageIndex = useRef(1);
  const loading = useRef(true);
  const typeRef = useRef<Type>('Recommend');
  const { addPlayList } = usePlayList();

  const loadOnePageData = async () => {
    if (!firstTime && loading.current) return;
    if (firstTime) {
      setState(state => ({ ...state, firstTime: false }));
    }
    loading.current = true;
    let newDynamics: IDynamic[] | null | undefined = [];
    switch (typeRef.current) {
      case 'Recommend':
        newDynamics = await api.getRecommendDynamics(pageIndex.current++, pageSize);
        break;
      case 'Latest':
        newDynamics = await api.getLatestDynamics(pageIndex.current++, pageSize);
        break;
      case 'Followed':
        break;
      default:
        break;
    }
    if (isEmpty(newDynamics)) {
      setState(state => ({
        ...state,
        hasMore: false,
      }));
    } else
      setState(state => ({
        ...state,
        dynamics: [...dynamics, ...newDynamics!],
      }));
    loading.current = false;
  };

  useEffect(() => {
    loadOnePageData();
  }, []);

  const cWidth = document.documentElement.clientWidth;
  useEffect(() => {
    const sideMode = cWidth > SM_CWIDTH ? 'inline' : 'horizontal';
    setState(state => ({ ...state, sideMode }));
  }, []);
  const changeType = (type: Type) => {
    window.scrollTo(0, 0);
    pageIndex.current = 1;
    typeRef.current = type;
    setState(state => ({ ...state, dynamics: [], type, hasMore: true }));
    loadOnePageData();
  };
  const sider = useMemo(
    () => (
      <Menu mode={sideMode} defaultSelectedKeys={['1']}>
        <Menu.Item key="1" onClick={() => changeType('Recommend')}>
          推荐
        </Menu.Item>
        <Menu.Item key="2" onClick={() => changeType('Latest')}>
          最新
        </Menu.Item>
        <Menu.Item key="3" onClick={() => changeType('Followed')}>
          关注
        </Menu.Item>
      </Menu>
    ),
    [sideMode]
  );

  const left = useMemo(
    () => (
      <Affix offsetTop={60}>
        <aside className="left">
          {sider}
          <div className="footer-container">
            <Footer />
          </div>
        </aside>
      </Affix>
    ),
    [sider]
  );

  const history = useHistory();
  const onComment = useCallback((id: number) => {
    history.push('/client/dynamic/' + id);
  }, []);
  const onLike = useCallback((id: number) => {
    console.log(id);
  }, []);
  const userInfo = useSelector((state: IStoreState) => state.LoginReducer);

  return (
    <div className="dynamic">
      <main className="main">
        <div className="dynamic-container">
          <If flag={cWidth > SM_CWIDTH} element1={left} />
          <div className="middle">
            <If flag={isEmpty(userInfo)} element2={<DynamicForm onClick={addPlayList} />} />
            <If flag={cWidth < SM_CWIDTH} element1={<Affix offsetTop={50}>{sider}</Affix>} />
            <div
              className="dynamic-card-container"
              style={{ marginTop: isEmpty(userInfo) ? 0 : '1rem' }}
            >
              <InfiniteScroll
                dataLength={dynamics.length}
                next={loadOnePageData}
                hasMore={hasMore && !firstTime}
                loader={<Skeleton avatar active />}
                endMessage={<Empty text="暂无更多..." />}
              >
                <For data={dynamics}>
                  {(dynamic: IDynamic) => (
                    <DynamicCard
                      onComment={onComment}
                      onLike={onLike}
                      onClickSong={addPlayList}
                      {...dynamic}
                      key={dynamic.id}
                    />
                  )}
                </For>
              </InfiniteScroll>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
export default Dynamics;
