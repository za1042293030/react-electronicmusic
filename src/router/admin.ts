import { IRouterConfig } from '@/common/typings';
import { lazy } from 'react';

const adminRouterConfig: IRouterConfig[] = [
  {
    path: '/admin',
    component: lazy(() => import('@/pages/Admin')),
    children: [
      {
        path: '/admin/login',
        component: lazy(() => import('@/pages/Admin/Login')),
        meta: {
          title: '后台管理 | 登录',
        },
      },
      {
        path: '/admin/main',
        component: lazy(() => import('@/pages/Admin/Main')),
        meta: {
          title: '后台管理 | 主页',
        },
        children: [
          {
            path: '/admin/main/audit',
            component: lazy(() => import('@/pages/Admin/Main/Audit')),
            meta: {
              title: '后台管理 | 审核',
            },
            children: [
              {
                path: '/admin/main/audit/album',
                component: lazy(() => import('@/pages/Admin/Main/Audit/Album')),
                meta: {
                  title: '后台管理 | 审核专辑',
                },
              },
              {
                path: '/admin/main/audit/comment',
                component: lazy(() => import('@/pages/Admin/Main/Audit/Comment')),
                meta: {
                  title: '后台管理 | 审核评论',
                },
              },
              {
                path: '/admin/main/audit/dynamic',
                component: lazy(() => import('@/pages/Admin/Main/Audit/Dynamic')),
                meta: {
                  title: '后台管理 | 审核动态',
                },
              },
              {
                path: '/admin/main/audit/playlist',
                component: lazy(() => import('@/pages/Admin/Main/Audit/PlayList')),
                meta: {
                  title: '后台管理 | 审核歌单',
                },
              },
              {
                path: '/admin/main/audit/song',
                component: lazy(() => import('@/pages/Admin/Main/Audit/Song')),
                meta: {
                  title: '后台管理 | 审核歌曲',
                },
              },
            ],
          },
          {
            path: '/admin/main/manage',
            component: lazy(() => import('@/pages/Admin/Main/Manage')),
            meta: {
              title: '后台管理 | 管理',
            },
          },
          {
            path: '/admin/main/index',
            component: lazy(() => import('@/pages/Admin/Main/Index/index')),
            meta: {
              title: '后台管理 | 首页',
            },
          },
          {
            path:'/admin/main',
            redirect:'/admin/main/index'
          }
        ],
      },
      {
        path: '/admin',
        redirect: '/admin/login',
      },
    ],
  },
];
export default adminRouterConfig;
