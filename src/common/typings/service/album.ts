import { ISearchAlbum, ISongSimple } from '.';

interface IAlbum extends ISearchAlbum {
  songs: ISongSimple[];
  describe?: string;
  createTime: string;
  commentedCount: number;
}
export type { IAlbum };
