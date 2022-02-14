import React, { FC, memo, ReactElement } from 'react';
import { LoadingOutlined } from '@ant-design/icons';
import { Spin } from 'antd';
import './index.less';
import { IProps } from './props';

const antIcon = <LoadingOutlined style={{ fontSize: 36 }} spin />;
/**
 * 读取组件
 * @returns
 */
const Loading: FC<IProps> = ({ global, width, height }): ReactElement => {
  return (
    <div
      className={'loading' + (global ? ' global' : '')}
      style={{ width: width && width + 'rem', height: height && height + 'rem' }}
    >
      <Spin indicator={antIcon} />
    </div>
  );
};
export default memo(Loading);
