import { IDynamic, ISongSimple, SendDynamicInfo } from '@/common/typings';
import { ajax } from './ajax';

async function getRecommendDynamics(
  pageIndex: number,
  pageSize: number
): Promise<IDynamic[] | null | undefined> {
  return (
    await ajax<IDynamic[]>({
      url: `/api/dynamic/getRecommendDynamics?pageIndex=${pageIndex}&pageSize=${pageSize}`,
    })
  )?.data.data;
}

async function getLatestDynamics(
  pageIndex: number,
  pageSize: number
): Promise<IDynamic[] | null | undefined> {
  return (
    await ajax<IDynamic[]>({
      url: `/api/dynamic/getLatestDynamics?pageIndex=${pageIndex}&pageSize=${pageSize}`,
    })
  )?.data.data;
}

async function getSongsByNameOrProducer(key: string): Promise<ISongSimple[] | null | undefined> {
  return (
    await ajax<ISongSimple[]>({
      url: `/api/song/getSongsByNameOrProducer?key=${key}`,
    })
  )?.data.data;
}

async function sendDynamic(data: SendDynamicInfo): Promise<boolean | null | undefined> {
  return (
    await ajax<boolean>({
      url: '/api/dynamic/sendDynamic',
      method: 'POST',
      data,
    })
  )?.data.data;
}

async function getDynamicById(id: number): Promise<IDynamic | null | undefined> {
  return (
    await ajax<IDynamic>({
      url: `/api/dynamic/getDynamicById?id=${id}`,
    })
  )?.data.data;
}
export {
  getRecommendDynamics,
  sendDynamic,
  getLatestDynamics,
  getSongsByNameOrProducer,
  getDynamicById,
};
