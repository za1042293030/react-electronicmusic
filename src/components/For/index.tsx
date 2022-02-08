import { isEmpty } from 'lodash';
import React, { createElement, VFC, memo, ReactElement, useMemo } from 'react';
import { Empty, If } from '..';
import { IProps } from './props';

const For: VFC<IProps> = ({ data, tag, parent, className, emptyEl, children }): ReactElement => {
  const childrenEl = useMemo(() => data && data.map(children), [data, children]);
  return (
    <If
      flag={parent || tag !== undefined}
      element1={createElement(tag ?? 'div', className ? { className } : null, childrenEl)}
      element2={
        <If flag={isEmpty(data)} element1={emptyEl ? <Empty /> : null} element2={childrenEl} />
      }
    ></If>
  );
};
For.defaultProps = {
  emptyEl: true,
};
export default memo(For);
