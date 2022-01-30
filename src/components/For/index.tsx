import React, { createElement, VFC, memo, ReactElement, useMemo } from 'react';
import { If } from '..';
import { IProps } from './props';

const For: VFC<IProps> = ({ data, tag, parent, className, children }): ReactElement => {
  const childrenEl = useMemo(() => data && data.map(children), [data, children]);
  return (
    <If
      flag={parent || tag !== undefined}
      element1={createElement(tag ?? 'div', className ? { className } : null, childrenEl)}
      element2={childrenEl}
    ></If>
  );
};
export default memo(For);
