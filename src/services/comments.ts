import { CommentType } from '@/common/enums';
import { IComment, IDelete, IPage, SendCommentInfo } from '@/common/typings';
import { ajax } from './ajax';

async function sendComment(data: SendCommentInfo): Promise<boolean | null | undefined> {
  return (
    await ajax<boolean>({
      url: '/api/comment/sendComment',
      method: 'POST',
      data,
    })
  )?.data.data;
}

async function getCommentsById(
  type: CommentType,
  id: number,
  pageIndex: number,
  pageSize: number,
): Promise<IComment[] | null | undefined> {
  return (
    await ajax<IComment[]>({
      url: `/api/comment/getCommentsById?type=${type}&id=${id}&pageIndex=${pageIndex}&pageSize=${pageSize}`,
    })
  )?.data.data;
}

async function getSubCommentsById(
  id: number,
  pageIndex: number,
  pageSize: number,
): Promise<IPage<IComment> | null | undefined> {
  return (
    await ajax<IPage<IComment>>({
      url: `/api/comment/getSubCommentsById?id=${id}&pageIndex=${pageIndex}&pageSize=${pageSize}`,
    })
  )?.data.data;
}

async function deleteComment(
  data: IDelete,
): Promise<boolean | null | undefined> {
  return (
    await ajax<boolean>({
      url: '/api/comment/deleteComment',
      method: 'POST',
      data,
    })
  )?.data.data;
}

export { sendComment, getCommentsById, getSubCommentsById, deleteComment };
