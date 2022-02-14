import { IRouterProps } from '@/common/typings';
import RouterGuard from '@/components/RoutingGuard';
import { useSetTitle } from '@/hooks';
import React, { FC, ReactElement } from 'react';

const Manage: FC<IRouterProps> = ({ route }): ReactElement => {
  useSetTitle(route.meta?.title!);
  return (
    <div>
      <RouterGuard routerConfig={route.children!} />
    </div>
  );
};
export default Manage;
