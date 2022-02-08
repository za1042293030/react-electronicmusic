import {
  IAddSongToPlayList,
  ICreatePlayList,
  IDelete,
  IPlayList,
  IUpdatePlayList,
} from '@/common/typings';
import { ajax } from './ajax';

async function getPlayListsById(id: number): Promise<IPlayList | null | undefined> {
  return (
    await ajax<IPlayList>({
      url: `/api/playlist/getPlayListsById?id=${id}`,
    })
  )?.data.data;
}

async function createPlayList(data: ICreatePlayList): Promise<boolean | null | undefined> {
  return (
    await ajax<boolean>({
      url: '/api/playlist/createPlayList',
      method: 'POST',
      data,
    })
  )?.data.data;
}

async function updatePlayList(data: IUpdatePlayList): Promise<boolean | null | undefined> {
  return (
    await ajax<boolean>({
      url: '/api/playlist/updatePlayList',
      method: 'POST',
      data,
    })
  )?.data.data;
}

async function deletePlayList(data: IDelete): Promise<boolean | null | undefined> {
  return (
    await ajax<boolean>({
      url: '/api/playlist/deletePlayList',
      method: 'POST',
      data,
    })
  )?.data.data;
}

async function addSongToPlayList(data: IAddSongToPlayList): Promise<boolean | null | undefined> {
  return (
    await ajax<boolean>({
      url: '/api/playlist/addSongToPlayList',
      method: 'POST',
      data,
    })
  )?.data.data;
}

async function deletePlayListSong(data: IAddSongToPlayList): Promise<boolean | null | undefined> {
  return (
    await ajax<boolean>({
      url: '/api/playlist/deletePlayListSong',
      method: 'POST',
      data,
    })
  )?.data.data;
}

export {
  getPlayListsById,
  createPlayList,
  updatePlayList,
  deletePlayList,
  addSongToPlayList,
  deletePlayListSong,
};
