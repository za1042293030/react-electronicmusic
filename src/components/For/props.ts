import { ReactNode } from 'react';

interface IProps<T = any> {
  data: T[];
  tag?: string;
  parent?: boolean;
  className?: string;
  emptyEl?: boolean;
  children: (item: T, index: number) => ReactNode;
}
export type { IProps };
