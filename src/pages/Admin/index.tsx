import { IRouterProps } from '@/common/typings';
import RouterGuard from '@/components/RoutingGuard';
import { useSetTitle } from '@/hooks';
import React, { FC, ReactElement } from 'react';
import './index.less';

const Admin: FC<IRouterProps> = ({ route }): ReactElement => {
  useSetTitle(route.meta?.title!);
  return (
    <div className="admin">
      <RouterGuard routerConfig={route.children!} />
    </div>
  );
};
export default Admin;
