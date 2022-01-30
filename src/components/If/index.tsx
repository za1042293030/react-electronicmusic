import { FC, memo, ReactElement } from 'react';
import { IProps } from './props';

const If: FC<IProps> = ({ flag, element1, element2 }): ReactElement | null => {

  return (flag ? element1 : element2) as ReactElement | null;
};

If.defaultProps = {
  element1: null,
  element2: null,
};
export default memo(If);
