import { ISong } from '@/common/typings';
import { ajax } from './ajax';

async function getSongById(id: number): Promise<ISong | null | undefined> {
  return (
    await ajax<ISong>({
      url: `/api/song/getSongById?id=${id}`,
    })
  )?.data.data;
}
export { getSongById };
