import { IDynamic, IPlayListSimple } from '@/common/typings';
import { ajax } from './ajax';

async function getDynamicByUserId(
  id: number,
  pageSize: number,
  pageIndex: number
): Promise<IDynamic[] | null | undefined> {
  return (
    await ajax<IDynamic[]>({
      url: `/api/dynamic/getDynamicByUserId?id=${id}&pageSize=${pageSize}&pageIndex=${pageIndex}`,
    })
  )?.data.data;
}

async function getPlayListsByUserId(
  id: number,
  pageIndex: number,
  pageSize: number
): Promise<IPlayListSimple[] | null | undefined> {
  return (
    await ajax<IPlayListSimple[]>({
      url: `/api/playlist/getPlayListsByUserId?id=${id}&pageIndex=${pageIndex}&pageSize=${pageSize}`,
    })
  )?.data.data;
}

export { getDynamicByUserId, getPlayListsByUserId };
