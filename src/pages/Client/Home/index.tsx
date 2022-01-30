import React, { FC, ReactElement} from 'react';
import './index.less';
import { IRouterProps } from '@/common/typings';
import { useSetTitle } from '@/hooks';
import { Swiper } from '@/components';

const Home: FC<IRouterProps> = ({ route }): ReactElement => {
  useSetTitle(route.meta?.title);

  return (
    <div>
      <main className="main">
        <Swiper />
      </main>
    </div>
  );
};
export default Home;
