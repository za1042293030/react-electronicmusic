import { IPlayListSimple, ISong } from '.';

interface IPlayList extends IPlayListSimple {
  createTime: string;
  commentedCount: number;
  songs: ISong[];
}

interface ICreatePlayList {
  name: string;
}

interface IUpdatePlayList {
  id: number;
  name?: string;
  describe?: string;
  coverId?: number;
}

interface IDelete {
  id: number;
}
interface IAddSongToPlayList {
  songId: number;
  playListId: number;
}

export type { IPlayList, ICreatePlayList, IUpdatePlayList, IDelete,IAddSongToPlayList };
