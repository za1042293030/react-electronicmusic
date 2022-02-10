import api from '@/services';
import { List, Skeleton, Comment as _Comment, Popconfirm } from 'antd';
import { isEmpty } from 'lodash';
import moment from 'moment';
import React, { FC, memo, ReactElement, useCallback, useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { Avatar, Empty, If } from '..';
import { IProps, IState } from './interface';
import './index.less';
import SubComment from './SubComment';
import ReplyForm from './ReplyForm';
import { useHistoryScroll, useUserInfo } from '@/hooks';

const Comment: FC<IProps> = ({
                               type,
                               id,
                               replyLoading,
                               subReplyLoading,
                               onSendReplyComment,
                               onSendSubReplyComment,
                               onDeleteComment,
                             }): ReactElement => {
  const { push } = useHistoryScroll();
  const [{ hasMore, comments, pageIndex }, setState] = useState<IState>({
    hasMore: true,
    comments: [],
    pageIndex: 1,
  });
  const { id: userId } = useUserInfo();

  const goToPersonalCenter = useCallback((id?: number) => {
    if (!id) return;
    push('/client/personalcenter/' + id);
  }, []);

  const loadData = useCallback(async (pageIn?: number) => {
    if (!id) return;
    const newComments = await api.getCommentsById(type, id, pageIn ?? pageIndex, 10);
    const empty = isEmpty(newComments);
    setState(state => ({
      ...state,
      hasMore: empty || (newComments && newComments.length < 10) ? false : true,
      comments: [
        ...state.comments,
        ...(newComments?.map(newComment => ({
          ...newComment,
          open: false,
          openReplyForm: false,
        })) ?? []),
      ],
      pageIndex: empty ? state.pageIndex : state.pageIndex + 1,
    }));
  }, [pageIndex, id]);

  useEffect(() => {
    loadData();
  }, [id]);

  const openReply = (id: number) => {
    setState(state => ({
      ...state,
      comments: state.comments.map(comment => {
        if (comment.id === id)
          return {
            ...comment,
            open: comment.id === id,
          };
        else return comment;
      }),
    }));
  };

  const openReplyForm = (id: number) => {
    setState(state => ({
      ...state,
      comments: state.comments.map(comment => ({
        ...comment,
        openReplyForm: comment.id === id,
      })),
    }));
  };

  return (
    <InfiniteScroll
      className='comment-scroll'
      dataLength={comments!.length}
      next={loadData}
      hasMore={hasMore}
      loader={<Skeleton avatar active />}
      endMessage={<Empty text='暂无更多评论...' />}
    >
      <If
        flag={comments!.length === 0}
        element2={
          <List
            className='comment'
            itemLayout='horizontal'
            dataSource={comments}
            size='small'
            renderItem={comment => (
              <li key={comment.id}>
                <_Comment
                  className='comment-item'
                  actions={[
                    <span key='comment-basic-reply-to' onClick={() => openReplyForm(comment.id)}>
                      回复Ta
                    </span>,
                    <If flag={userId === comment.createBy.id}
                        element1={
                          <Popconfirm
                            title='确定删除吗？'
                            okText='确定'
                            cancelText='取消'
                            onConfirm={async () => {
                              if (onDeleteComment) {
                                await onDeleteComment(comment.id);
                                window.scrollTo(0, 0);
                                setState(state => ({
                                  ...state,
                                  pageIndex: 1,
                                  comments: [],
                                  hasMore: true,
                                }));
                                loadData(1);
                              }
                            }
                            }
                          >
                            <span>删除</span>
                          </Popconfirm>
                        } />,
                    <If
                      flag={comment.replyCount > 0 && !comment.open}
                      element1={
                        <a className='open-reply' onClick={() => openReply(comment.id)}>
                          展开{comment.replyCount}条回复...
                        </a>
                      }
                    />,
                  ]}
                  avatar={
                    <Avatar
                      imgSrc={comment.createBy?.avatar}
                      size={3}
                      id={comment.createBy?.id}
                      onClick={goToPersonalCenter}
                    />
                  }
                  author={comment.createBy?.nickName}
                  content={comment.content}
                  datetime={moment(comment.createTime).utcOffset(8).fromNow()}
                >
                  <If
                    flag={comment.replyCount > 0 && comment.open}
                    element1={
                      <SubComment
                        id={comment.id}
                        goToPersonalCenter={goToPersonalCenter}
                        type={type}
                        onSendSubReplyComment={onSendSubReplyComment}
                        subReplyLoading={subReplyLoading}
                        onDeleteComment={onDeleteComment}
                      />
                    }
                  />
                </_Comment>
                <If
                  flag={comment.openReplyForm}
                  element1={
                    <ReplyForm
                      onSendComment={value =>
                        onSendReplyComment && onSendReplyComment(value, comment.id)
                      }
                      placeholder={'回复@' + comment?.createBy.nickName + '：'}
                      submitLoading={replyLoading}
                      btnText='回复'
                    />
                  }
                />
              </li>
            )}
          />
        }
      />
    </InfiniteScroll>
  );
};
export default memo(Comment);
