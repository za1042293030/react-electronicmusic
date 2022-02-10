import React, {
  FC,
  ReactElement,
  createElement,
  useRef,
  useCallback,
  useMemo,
  memo,
  useState,
  useEffect,
} from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import Avatar from '@/components/Avatar';
import './index.less';
import { IProps } from './props';
import { Popup, IPopupRef, For, SearchInput, If } from '@/components';
import { Affix, Badge, List, Tooltip, Typography } from 'antd';
import { LoginOutlined } from '@ant-design/icons';
import { MD_CWIDTH } from '@/common/constants/clientwidth';
import { ILink, ISongSimple } from '@/common/typings';
import api from '@/services';
import { useHistoryScroll, useUserInfo } from '@/hooks';
import { decode } from 'querystring';

const { Title } = Typography;

interface IState {
  searchList: ISongSimple[];
  loading: boolean;
}

const Header: FC<IProps> = ({ linkList }): ReactElement => {
  const [{ searchList, loading }, setState] = useState<IState>({
    searchList: [],
    loading: true,
  });

  const { push } = useHistoryScroll();
  const location = useLocation();
  const { userInfo, isLogin, id } = useUserInfo();

  const goToSearchPage = useCallback((value: string): void => {
    if (decode(location.search)['?key'] === value) return;
    if (!location.pathname.includes('/client/search') && location.pathname !== '/client/search') {
      push('/client/search/song' + (value ? '?key=' + value : ''));
    } else {
      push(location.pathname + '?key=' + value);
    }
  }, []);

  const goToPersonalCenter = useCallback(() => {
    const cWidth = document.documentElement.clientWidth;
    if (isLogin) {
      push('/client/personalcenter/' + id);
    } else if (cWidth < MD_CWIDTH) {
      push('/client/sign/login');
    }
  }, [id]);

  const dynamicRef = useRef<IPopupRef>(null);

  useEffect(() => {
    (async () => {
      const list = await api.getRecommendSongs(10);
      setState({
        searchList: list ?? [],
        loading: false,
      });
    })();
  }, []);
  const searchInputChilren = useMemo(
    () => (
      <>
        <Title level={5} className='search-input-recommend'>
          为您推荐：
        </Title>
        <List
          loading={loading}
          size='small'
          dataSource={searchList}
          renderItem={song => (
            <List.Item
              style={{ cursor: 'pointer' }}
              onClick={() => push('/client/search?key=' + song.name)}
              key={song.id}
            >
              <p className='list-item'>
                <span className='song-name'>{song.name}</span>
                <span className='song-artists'>
                  {song.artists.map(artist => artist.nickName).join(',')}
                </span>
              </p>
            </List.Item>
          )}
        />
      </>
    ),
    [loading, history],
  );
  const loggedUserList = useMemo(
    () => (
      <ul className='header-user-list'>
        <li
          className='item transition-2'
          onMouseEnter={() => {
            dynamicRef.current?.onOpen();
          }}
          onMouseLeave={() => {
            dynamicRef.current?.onClose(300);
          }}
        >
          <Badge count={5} size='small'>
            <span className='text'>消息</span>
            <Popup ref={dynamicRef} width={40} height={40}>
              <p>11111</p>
            </Popup>
          </Badge>
        </li>
      </ul>
    ),
    [],
  );
  const unLoginUserList = useMemo(
    () => (
      <Tooltip
        placement='bottom'
        title='登录后享用更多功能'
        defaultVisible={document.documentElement.clientWidth > MD_CWIDTH}
      >
        <Link to='/client/sign/login' className='header-user-list'>
          <span className='text'>登录</span>
          <LoginOutlined className='icon' />
        </Link>
      </Tooltip>
    ),
    [],
  );
  const link = useCallback(
    (link: ILink, index: number) => (
      <li className='header-link transition-2' key={index}>
        <NavLink to={link.path} className='link transition-2' activeClassName='route-active'>
          <i className='icon'>{createElement(link.icon)}</i>
          <span className='name'>{link.name}</span>
        </NavLink>
      </li>
    ),
    [],
  );
  return (
    <Affix offsetTop={0}>
      <header className='header transition-5'>
        <div className='header-logo transition-5'>
          <img
            src='https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fpic1.nipic.com%2F2008-11-11%2F20081111143325675_2.jpg&refer=http%3A%2F%2Fpic1.nipic.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1643355627&t=549eab1fd14b9e6e5b2d018586acae16' />
        </div>
        <div className='header-middle'>
          <For data={linkList} tag='ul' className='header-link-box'>
            {link}
          </For>
          <SearchInput placeholder='搜索音乐、制作人' popup onSearch={goToSearchPage} width={50}>
            {searchInputChilren}
          </SearchInput>
        </div>
        <div className='header-user transition-5'>
          <Avatar
            imgSrc={!isLogin ? undefined : userInfo?.avatar}
            size={4}
            title={!isLogin ? '未登录' : userInfo?.nickName}
            onClick={goToPersonalCenter}
          />
          <If flag={!isLogin} element1={unLoginUserList} element2={loggedUserList} />
        </div>
      </header>
    </Affix>
  );
};
export default memo(Header);
