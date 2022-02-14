import { IComment } from '.';

interface IDynamicSong {
  id: number;
  file: string;
  name: string;
  cover: string;
  artists: { nickName: string; id: number }[];
}

interface IDynamicUser {
  id: number;
  avatar: string;
  nickName: string;
}

interface IDynamicPic {
  id: number;
  src: string;
}

interface IDynamic {
  id: number;
  createTime: string;
  content: string;
  createBy: IDynamicUser;
  likedCount: number;
  commentedCount: number;
  song?: IDynamicSong;
  pictures?: IDynamicPic[];
  isPublish: boolean;
  visible?: boolean;
}

interface IDynamicWithComment extends IDynamic {
  comments?: IComment[];
}

interface SendDynamicInfo {
  content: string;
  songId?: number;
  pictureIds?: number[];
  isPrivate: boolean;
}

export type {
  IDynamicSong,
  IDynamicUser,
  IDynamicPic,
  IDynamic,
  SendDynamicInfo,
  IDynamicWithComment,
};
