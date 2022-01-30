import { IPlayListSimple, ISong } from '.';

interface IPlayList extends IPlayListSimple {
  describe?: string;
  createTime: string;
  commentCount: number;
  songs: ISong[];
}
export type { IPlayList };
