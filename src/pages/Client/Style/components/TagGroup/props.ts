import { IStyle } from '@/common/typings/service';

interface IProps {
  tags: IStyle[];
  chooseId?: number;
  emptyEl?: boolean;
  onChange?: (tag: IStyle) => void;
  onMouseEnter?: (tag: IStyle) => void;
}
export type { IProps };
