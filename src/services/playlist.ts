import { IPlayList } from '@/common/typings';
import { ajax } from './ajax';

async function getPlayListsById(id: number): Promise<IPlayList | null | undefined> {
  return (
    await ajax<IPlayList>({
      url: `/api/playlist/getPlayListsById?id=${id}`,
    })
  )?.data.data;
}
export { getPlayListsById };
