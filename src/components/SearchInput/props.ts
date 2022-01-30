import { PropsWithChildren } from 'react';

type IProps = PropsWithChildren<{
  placeholder: string;
  popup?: boolean;
  width?: number;
  onSearch?: (value: string) => void;
}>;
export type { IProps };
