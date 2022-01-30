import { CommentType } from '@/common/enums';
import api from '@/services';
import { commentContentValid } from '@/utils';
import { message } from 'antd';

function useComment(type: CommentType, id?: number) {
  const sendComment = async (value: string) => {
    if (!commentContentValid(value) || !id) return;
    message.loading('发布中，请稍候');
    const flag = await api.sendComment({
      content: value,
      type,
      id,
    });
    message.destroy();
    if (flag) {
      message.success('发布成功，审核马上就好');
    } else {
      message.error('发布失败');
    }
  };

  const sendReplyComment = async (value: string, commentId: number) => {
    if (!commentContentValid(value) || !commentId || !id) return;
    message.loading('发布中，请稍候');
    const flag = await api.sendComment({
      content: value,
      type,
      id,
      replyToId: commentId,
    });
    message.destroy();
    if (flag) {
      message.success('发布成功，审核马上就好');
    } else {
      message.error('发布失败');
    }
  };
  return {
    sendComment,
    sendReplyComment,
  };
}
export { useComment };
