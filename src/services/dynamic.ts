import { IDelete, IDynamic, IPage, ISongSimple, SendDynamicInfo } from '@/common/typings';
import { ajax } from './ajax';

async function getRecommendDynamics(
  pageIndex: number,
  pageSize: number,
): Promise<IDynamic[] | null | undefined> {
  return (
    await ajax<IDynamic[]>({
      url: `/api/dynamic/getRecommendDynamics?pageIndex=${pageIndex}&pageSize=${pageSize}`,
    })
  )?.data.data;
}

async function getLatestDynamics(
  pageIndex: number,
  pageSize: number,
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

async function deleteDynamic(data: IDelete): Promise<boolean | null | undefined> {
  return (
    await ajax<boolean>({
      url: '/api/dynamic/deleteDynamic',
      method: 'POST',
      data,
    })
  )?.data.data;
}

async function getApprovingDynamics(pageIndex: number, pageSize: number): Promise<IPage<IDynamic> | null | undefined> {
  return (
    await ajax<IPage<IDynamic>>({
      url: `/api/dynamic/getApprovingDynamics?pageIndex=${pageIndex}&pageSize=${pageSize}`,
    })
  )?.data.data;
}

async function changeDynamicsAuditStatus(id: number, status: number): Promise<boolean | null | undefined> {
  return (
    await ajax<boolean>({
      url: `/api/dynamic/changeDynamicsAuditStatus?id=${id}&status=${status}`,
      method:'POST'
    })
  )?.data.data;
}

export {
  getRecommendDynamics,
  sendDynamic,
  getLatestDynamics,
  getSongsByNameOrProducer,
  getDynamicById,
  deleteDynamic,
  getApprovingDynamics,
  changeDynamicsAuditStatus
};
