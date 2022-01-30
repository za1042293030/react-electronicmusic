import { CommentType } from '@/common/enums';
import { IComment } from '@/common/typings';

interface IState {
  hasMore: boolean;
  comments: IComment[];
  pageIndex: number;
}
interface IProps {
  type: CommentType;
  id?: number;
  onSendReplyComment?: (value: string, commentId: number) => void;
}
export type { IState, IProps };
