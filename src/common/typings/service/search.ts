import { IUserSimple, IStyle } from '.';

interface ISearchSong {
  id: number;
  name: string;
  file: string;
  cover: string;
  artists: IUserSimple[];
  album: {
    id: number;
    name: string;
  };
}
interface ISearchAlbum {
  id: number;
  name: string;
  artists: IUserSimple[];
  cover: string;
  styles: IStyle[];
}
interface ISearchUser {
  id: number;
  nickName: string;
  avatar: string;
}
interface ISearchPlayList {
  id: number;
  name: string;
  createBy: IUserSimple;
  styles: IStyle[];
  cover: string | null;
}
export type { ISearchSong, ISearchAlbum, ISearchUser, ISearchPlayList };
