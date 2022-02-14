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
  replyLoading?: boolean;
  subReplyLoading?: boolean;
  onSendSubReplyComment?: (value: string, commentId: number) => void | Promise<void>;
  onSendReplyComment?: (value: string, commentId: number) => void | Promise<void>;
  onDeleteComment?: (id: number) => void | Promise<void>;
}

export type { IState, IProps };
