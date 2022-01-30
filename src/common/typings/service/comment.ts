import { CommentType } from '@/common/enums';
import { IDynamicUser, ISearchUser } from '.';

interface IComment {
  id: number;
  content: string;
  likedCount: number;
  createTime: string;
  createBy: ISearchUser;
  replyCount: number;
  replyTo: IDynamicUser;
  open: boolean;
  openReplyForm: boolean;
}
interface SendCommentInfo {
  content: string;
  type: CommentType;
  id: number;
  replyToId?: number;
}
export type { IComment, SendCommentInfo };
