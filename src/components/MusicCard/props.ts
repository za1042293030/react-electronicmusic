import { CSSProperties, ReactElement, ReactNode } from 'react';

interface IProps {
  src?: string;
  imgTitle?: string;
  className?: string;
  width?: number;
  height?: number;
  children?: ReactElement | ReactElement[] | ReactNode;
  row?: boolean;
  style?: CSSProperties;
  fileSrc?: string;
  imgWidth?: number;
  imgHeight?: number;
  lazyLoad?: boolean;
  playBtn?: boolean;
  onClick?: (fileSrc?: string) => void;
}
export type { IProps };
