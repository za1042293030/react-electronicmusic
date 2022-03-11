import {
  IAddSongToPlayList,
  ICreatePlayList,
  IDelete, IPage,
  IPlayList, IPlayListSimple,
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

async function getApprovingPlayLists(
  pageIndex: number,
  pageSize: number,
): Promise<IPage<IPlayListSimple> | null | undefined> {
  return (
    await ajax<IPage<IPlayListSimple>>({
      url: `/api/playlist/getApprovingPlayLists?pageIndex=${pageIndex}&pageSize=${pageSize}`,
    })
  )?.data.data;
}

async function changePlayListsAuditStatus(id: number, status: number): Promise<boolean | null | undefined> {
  return (
    await ajax<boolean>({
      url: `/api/playlist/changePlayListsAuditStatus?id=${id}&status=${status}`,
      method: 'POST',
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
  getApprovingPlayLists,
  changePlayListsAuditStatus
};
