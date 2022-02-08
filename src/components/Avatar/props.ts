interface IProps {
  id?: number;
  imgSrc?: string;
  title?: string;
  size?: number;
  editIcon?: boolean;
  onClick?: (id?: number) => void;
}
export type { IProps };
