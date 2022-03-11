import { BaseResponse, IFile, ISongSimple } from '.';
import { UploadChangeParam, UploadFile } from 'antd/lib/upload/interface';

interface ISong extends ISongSimple {
  describe?: string;
  createTime: string;
  commentedCount: number;
}

interface IRawCreateSong {
  cover: UploadChangeParam<UploadFile<BaseResponse<IFile>>>;
  describe?: string;
  file: UploadChangeParam<UploadFile<BaseResponse<IFile>>>;
  name: string;
}

interface ICreateSong {
  cover: number;
  describe?: string;
  file: number;
  name: string;
}

export type { ISong, ICreateSong, IRawCreateSong };
