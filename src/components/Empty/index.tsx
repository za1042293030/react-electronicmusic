import React, { FC, memo, ReactElement } from 'react';
import './index.less';
import { IProps } from './props';

const Empty: FC<IProps> = ({ text }): ReactElement => {
  return <p className="empty">{text ?? '暂无数据...'}</p>;
};
export default memo(Empty);
