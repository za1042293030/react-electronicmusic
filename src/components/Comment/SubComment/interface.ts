import { CommentType } from '@/common/enums';
import { IComment } from '@/common/typings';

interface IProps {
  id: number;
  type: CommentType;
  goToPersonalCenter?: (id?: number) => void;
  onSendReplyComment?: (value: string, commentId: number) => void;
}
interface IState {
  comments: IComment[];
  pageIndex: number;
  total: number;
  loading: boolean;
}
export type { IProps, IState };
