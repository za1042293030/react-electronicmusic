import { IRouterProps } from '@/common/typings';
import { useSetTitle } from '@/hooks';
import React, { FC, ReactElement } from 'react';

const Index: FC<IRouterProps> = ({ route }): ReactElement => {
  useSetTitle(route.meta?.title!);
  return (
    <div>
      欢迎来到电子音乐网站后台管理系统
    </div>
  );
};
export default Index;
