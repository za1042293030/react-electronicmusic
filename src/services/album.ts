import { IAlbum, ICreateAlbum, IPage, ISearchAlbum } from '@/common/typings';
import { ajax } from './ajax';

async function getRecommendAlbums(size: number): Promise<ISearchAlbum[] | null | undefined> {
  return (
    await ajax<ISearchAlbum[]>({
      url: `/api/album/getRecommendAlbums?size=${size}`,
    })
  )?.data.data;
}

async function getAlbumById(id: number): Promise<IAlbum | null | undefined> {
  return (
    await ajax<IAlbum>({
      url: `/api/album/getAlbumById?id=${id}`,
    })
  )?.data.data;
}

async function getAlbumByUserId(id: number, pageIndex: number, pageSize: number): Promise<ISearchAlbum[] | null | undefined> {
  return (
    await ajax<ISearchAlbum[]>({
      url: `/api/album/getAlbumByUserId?id=${id}&pageIndex=${pageIndex}&pageSize=${pageSize}`,
    })
  )?.data.data;
}

async function getApprovingAlbums(pageIndex: number, pageSize: number): Promise<IPage<ISearchAlbum> | null | undefined> {
  return (
    await ajax<IPage<ISearchAlbum>>({
      url: `/api/album/getApprovingAlbums?pageIndex=${pageIndex}&pageSize=${pageSize}`,
    })
  )?.data.data;
}

async function createAlbum(data: ICreateAlbum): Promise<boolean | null | undefined> {
  return (
    await ajax<boolean>({
      url: '/api/album/createAlbum',
      method: 'POST',
      data,
    })
  )?.data.data;
}

async function changeAlbumsAuditStatus(id: number, status: number): Promise<boolean | null | undefined> {
  return (
    await ajax<boolean>({
      url: `/api/album/changeAlbumsAuditStatus?id=${id}&status=${status}`,
      method: 'POST',
    })
  )?.data.data;
}

export {
  getRecommendAlbums,
  getAlbumById,
  getAlbumByUserId,
  getApprovingAlbums,
  createAlbum,
  changeAlbumsAuditStatus,
};
