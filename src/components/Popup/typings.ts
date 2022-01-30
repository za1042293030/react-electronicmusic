import { PropsWithChildren } from 'react';

type IProps = PropsWithChildren<{
  height?: number;
  width?: number;
}>;
interface IState {
  _width?: number | undefined;
  _height?: number;
  leftOffset?: number;
  state?: boolean;
}
export type { IProps, IState };
