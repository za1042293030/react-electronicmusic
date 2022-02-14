import { IRouterProps } from '@/common/typings';
import { useSetTitle } from '@/hooks';
import React, { FC, ReactElement } from 'react';

const Song: FC<IRouterProps> = ({ route }): ReactElement => {
  useSetTitle(route.meta?.title!);
  return (
    <div>
    </div>
  );
};
export default Song;
