import { IRouterProps } from '@/common/typings';
import { useSetTitle } from '@/hooks';
import React, { FC, ReactElement } from 'react';

const Error401: FC<IRouterProps> = ({ route }): ReactElement => {
  useSetTitle(route.meta?.title!);
  return (
    <div>
      <p>抱歉！您的账户无权访问该页面！</p>
    </div>
  );
};
export default Error401;
