import { IRouterProps } from '@/common/typings';
import { useSetTitle } from '@/hooks';
import React, { FC, ReactElement } from 'react';

const Producer: FC<IRouterProps> = ({ route }): ReactElement => {
  useSetTitle(route.meta?.title);
  return (
    <div className="producer">
      <main className="main"></main>
    </div>
  );
};
export default Producer;
