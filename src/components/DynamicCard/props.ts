import { IDynamicSong } from '@/common/typings';

interface IProps {
  openComment?: boolean;
  onComment?: (id: number) => void;
  onLike?: (id: number) => void;
  onShare?: (id: number) => void;
  onClickSong?: (song: IDynamicSong) => void;
  onSendComment?: (value: string) => void;
  onSendReplyComment?: (value: string, commentId: number) => void;
}
export type { IProps };
