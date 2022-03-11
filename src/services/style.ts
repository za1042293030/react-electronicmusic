import { IPage, IPlayListSimple, ISongSimple, IStyle } from '@/common/typings';
import { ajax } from './ajax';

async function getAllStyles(): Promise<IStyle[] | null | undefined> {
  return (
    await ajax<IStyle[]>({
      url: '/api/style/getAllStyles',
    })
  )?.data.data;
}

async function getSelectStyles(): Promise<IStyle[] | null | undefined> {
  return (
    await ajax<IStyle[]>({
      url: '/api/style/getSelectStyles',
    })
  )?.data.data;
}

async function getSongsByStyleId(
  id: number,
  pageIndex: number,
  pageSize: number
): Promise<IPage<ISongSimple> | null | undefined> {
  return (
    await ajax<IPage<ISongSimple>>({
      url: `/api/song/getSongsByStyleId?id=${id}&pageIndex=${pageIndex}&pageSize=${pageSize}`,
    })
  )?.data.data;
}

async function getRecommendSongs(
  size: number,
  style = false
): Promise<ISongSimple[] | null | undefined> {
  return (
    await ajax<ISongSimple[]>({
      url: `/api/song/getRecommendSongs?size=${size}&style=${style}`,
    })
  )?.data.data;
}

async function getRecommendPlayLists(size: number): Promise<IPlayListSimple[] | null | undefined> {
  return (
    await ajax<IPlayListSimple[]>({
      url: `/api/playlist/getRecommendPlayLists?size=${size}`,
    })
  )?.data.data;
}

async function getPlayListsByStyleId(
  id: number,
  pageIndex: number,
  pageSize: number
): Promise<IPage<IPlayListSimple> | null | undefined> {
  return (
    await ajax<IPage<IPlayListSimple>>({
      url: `/api/playlist/getPlayListsByStyleId?id=${id}&pageIndex=${pageIndex}&pageSize=${pageSize}`,
    })
  )?.data.data;
}

export {
  getSongsByStyleId,
  getAllStyles,
  getRecommendSongs,
  getRecommendPlayLists,
  getPlayListsByStyleId,
  getSelectStyles
};
