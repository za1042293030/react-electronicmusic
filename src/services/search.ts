import { IPage, ISearchAlbum, ISearchPlayList, ISearchSong, ISearchUser } from '@/common/typings';
import { ajax } from './ajax';

async function searchSongs(
  key: string,
  pageIndex: number,
  pageSize: number
): Promise<IPage<ISearchSong> | null | undefined> {
  return (
    await ajax<IPage<ISearchSong>>({
      url: `/api/search/songs?key=${key}&pageIndex=${pageIndex}&pageSize=${pageSize}`,
    })
  )?.data.data;
}

async function searchAlbums(
  key: string,
  pageIndex: number,
  pageSize: number
): Promise<IPage<ISearchAlbum> | null | undefined> {
  return (
    await ajax<IPage<ISearchAlbum>>({
      url: `/api/search/albums?key=${key}&pageIndex=${pageIndex}&pageSize=${pageSize}`,
    })
  )?.data.data;
}

async function searchUsers(
  key: string,
  pageIndex: number,
  pageSize: number
): Promise<IPage<ISearchUser> | null | undefined> {
  return (
    await ajax<IPage<ISearchUser>>({
      url: `/api/search/users?key=${key}&pageIndex=${pageIndex}&pageSize=${pageSize}`,
    })
  )?.data.data;
}

async function searchArtists(
  key: string,
  pageIndex: number,
  pageSize: number
): Promise<IPage<ISearchUser> | null | undefined> {
  return (
    await ajax<IPage<ISearchUser>>({
      url: `/api/search/artists?key=${key}&pageIndex=${pageIndex}&pageSize=${pageSize}`,
    })
  )?.data.data;
}

async function searchPlayLists(
  key: string,
  pageIndex: number,
  pageSize: number
): Promise<IPage<ISearchPlayList> | null | undefined> {
  return (
    await ajax<IPage<ISearchPlayList>>({
      url: `/api/search/playlists?key=${key}&pageIndex=${pageIndex}&pageSize=${pageSize}`,
    })
  )?.data.data;
}

export { searchSongs, searchAlbums, searchUsers, searchArtists, searchPlayLists };
