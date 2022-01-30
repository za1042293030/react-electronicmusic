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
      },
      {
        path: '/admin',
        redirect: '/admin/login',
      },
    ],
  },
];
export default adminRouterConfig;
