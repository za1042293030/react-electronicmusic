import { IRouterProps } from '@/common/typings';
import { useSetTitle } from '@/hooks';
import React, { FC, ReactElement, useEffect, useState } from 'react';

const Index: FC<IRouterProps> = ({ route }): ReactElement => {
  useSetTitle(route.meta?.title!);

  const [title, setTitle] = useState('欢迎来到电子音乐网站后台管理系统');

  useEffect(() => {
    const timer = setTimeout(() => {
      setTitle(title.charAt(title.length - 1) + title.substring(0, title.length - 1));
    }, 500);
    return () => {
      clearTimeout(timer);
    };
  }, [title]);

  return (
    <div>
      {title}
    </div>
  );
};
export default Index;
