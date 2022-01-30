import { linkList } from '@/common/constants';
import { IRouterProps } from '@/common/typings';
import { Footer } from '@/components';
import { Header } from '@/components';
import { useSetTitle } from '@/hooks';
import React, { FC, ReactElement } from 'react';

const Rank: FC<IRouterProps> = ({ route }): ReactElement => {
  useSetTitle(route.meta?.title!);
  return (
    <div>
      <Header linkList={linkList} />
      rank
      <Footer />
    </div>
  );
};
export default Rank;
