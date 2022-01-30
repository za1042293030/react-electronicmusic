import { IRouterProps } from '@/common/typings';
import { useSetTitle } from '@/hooks';
import { Button, Result } from 'antd';
import React, { FC, ReactElement } from 'react';

const Error404: FC<IRouterProps> = ({ history, route }): ReactElement => {
  useSetTitle(route.meta?.title!);

  const backToHome = () => {
    history.replace('/');
  };
  return (
    <Result
      status="404"
      title="404 not found..."
      extra={
        <Button type="primary" onClick={backToHome}>
          点此返回主页
        </Button>
      }
    />
  );
};
export default Error404;
