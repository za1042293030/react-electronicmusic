import { ReactNode } from 'react';

interface IProps<T = any> {
  data: T[];
  tag?: string;
  parent?: boolean;
  className?: string;
  children: (item: T, index: number) => ReactNode;
}
export type { IProps };
