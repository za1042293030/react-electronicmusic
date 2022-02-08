import { IRouter } from '@/common/typings';
import { lazy } from 'react';
import adminRouterConfig from './admin';

const routerConfig: IRouter[] = [
  {
    path: '/client',
    component: lazy(() => import('@/pages/Client')),
    children: [
      {
        path: '/client/albums',
        component: lazy(() => import('@/pages/Client/Albums')),
        meta: {
          title: '专辑',
        },
      },
      {
        path: '/client/style',
        component: lazy(() => import('@/pages/Client/Style')),
        meta: {
          title: '风格',
        },
        children: [
          {
            path: '/client/style/songs',
            component: lazy(() => import('@/pages/Client/Style/Songs')),
            meta: {
              title: '风格 | 音乐',
            },
          },
          {
            path: '/client/style/playlists',
            component: lazy(() => import('@/pages/Client/Style/Playlists')),
            meta: {
              title: '风格 | 歌单',
            },
          },
          {
            path: '/client/style',
            redirect: '/client/style/songs',
          },
        ],
      },
      {
        path: '/client/album/:id',
        component: lazy(() => import('@/pages/Client/Album')),
        meta: {
          title: '专辑详情',
        },
      },
      {
        path: '/client/song/:id',
        component: lazy(() => import('@/pages/Client/Song')),
        meta: {
          title: '歌曲详情',
        },
      },
      {
        path: '/client/playlist/:id',
        component: lazy(() => import('@/pages/Client/PlayList')),
        meta: {
          title: '歌单详情',
        },
      },
      {
        path: '/client/search',
        component: lazy(() => import('@/pages/Client/Search')),
        meta: {
          title: '搜索',
        },
        children: [
          {
            path: '/client/search/song',
            component: lazy(() => import('@/pages/Client/Search/Song')),
            meta: {
              title: '搜索 | 歌曲',
            },
          },
          {
            path: '/client/search/album',
            component: lazy(() => import('@/pages/Client/Search/Album')),
            meta: {
              title: '搜索 | 专辑',
            },
          },
          {
            path: '/client/search/playlist',
            component: lazy(() => import('@/pages/Client/Search/PlayList')),
            meta: {
              title: '搜索 | 歌单',
            },
          },
          {
            path: '/client/search/user',
            component: lazy(() => import('@/pages/Client/Search/User')),
            meta: {
              title: '搜索 | 用户',
            },
          },
          {
            path: '/client/search/artist',
            component: lazy(() => import('@/pages/Client/Search/Artist')),
            meta: {
              title: '搜索 | 制作人',
            },
          },
          {
            path: '/client/search',
            redirect: '/client/search/song',
          },
        ],
      },
      {
        path: '/client/personalcenter/:id',
        component: lazy(() => import('@/pages/Client/PersonalCenter')),
        meta: {
          title: '个人中心',
          auth: true,
        },
      },
      {
        path: '/client/sign',
        component: lazy(() => import('@/pages/Client/Sign')),
        meta: {
          title: '登录',
        },
        children: [
          {
            path: '/client/sign/login',
            component: lazy(() => import('@/pages/Client/Sign/Login')),
            meta: {
              title: '登录',
            },
          },
          {
            path: '/client/sign/register',
            component: lazy(() => import('@/pages/Client/Sign/Register')),
            meta: {
              title: '注册',
            },
          },
          {
            path: '/client/sign',
            redirect: '/client/sign/login',
          },
        ],
      },
      {
        path: '/client/dynamics',
        component: lazy(() => import('@/pages/Client/Dynamics')),
        meta: {
          title: '动态',
          keepAlive: true,
        },
      },
      {
        path: '/client/dynamic/:id',
        component: lazy(() => import('@/pages/Client/Dynamic')),
        meta: {
          title: '动态详情',
          auth: true,
        },
      },
      {
        path: '/client',
        redirect: '/client/home',
      },
    ],
  },
  ...adminRouterConfig,
  {
    path: '/401',
    component: lazy(() => import('@/pages/401')),
    meta: {
      title: '无权限访问！',
    },
  },
  {
    path: '/404',
    component: lazy(() => import('@/pages/404')),
    meta: {
      title: '出错啦！',
    },
  },
  {
    path: '/',
    redirect: '/client/style',
  },
];
export default routerConfig;
