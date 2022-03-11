import { ISearchAlbum, ISongSimple, ICreateSong, BaseResponse, IFile, IRawCreateSong } from '.';
import { UploadChangeParam, UploadFile } from 'antd/lib/upload/interface';

interface IAlbum extends ISearchAlbum {
  songs: ISongSimple[];
  describe?: string;
  createTime: string;
  commentedCount: number;
}

interface IRawCreateAlbum {
  cover: UploadChangeParam<UploadFile<BaseResponse<IFile>>>;
  describe?: string;
  name: string;
  songs: IRawCreateSong[];
}

interface ICreateAlbum {
  cover: number;
  describe?: string;
  name: string;
  songs: ICreateSong[];
}

export type { IAlbum, ICreateAlbum, IRawCreateAlbum };
