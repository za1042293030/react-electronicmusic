import { IAlbum, ISearchAlbum } from '@/common/typings';
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

export { getRecommendAlbums, getAlbumById };
