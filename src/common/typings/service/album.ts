import { ISearchAlbum, ISongSimple } from '.';

interface IAlbum extends ISearchAlbum {
  songs: ISongSimple[];
  describe?: string;
  createTime: string;
  commentCount: number;
}
export type { IAlbum };
