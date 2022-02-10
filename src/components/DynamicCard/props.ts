import { IDynamicSong } from '@/common/typings';

interface IProps {
  openComment?: boolean;
  replyLoading?: boolean;
  submitLoading?: boolean;
  subReplyLoading?: boolean;
  deleteLoading?: boolean;
  onComment?: (id: number) => void;
  onClickSong?: (song: IDynamicSong) => void;
  onSendComment?: (value: string) => void;
  onSendReplyComment?: (value: string, commentId: number) => void;
  onSendSubReplyComment?: (value: string, commentId: number) => void;
  onDelete?: (id: number) => void | Promise<void>;
  onDeleteComment?: (id: number) => void | Promise<void>;
}

export type { IProps };
