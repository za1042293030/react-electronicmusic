import { ReactElement, ReactNode } from 'react';

interface IProps {
  flag: boolean | undefined | null;
  element1?: ReactElement | ReactNode | null;
  element2?: ReactElement | ReactNode | null;
}
export type { IProps };
