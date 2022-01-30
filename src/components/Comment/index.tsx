import api from '@/services';
import { List, Skeleton, Comment as _Comment } from 'antd';
import { isEmpty } from 'lodash';
import moment from 'moment';
import React, { FC, memo, ReactElement, useCallback, useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useHistory } from 'react-router-dom';
import { Avatar, Empty, If } from '..';
import { IProps, IState } from './interface';
import './index.less';
import SubComment from './SubComment';
import ReplyForm from './ReplyForm';

const Comment: FC<IProps> = ({ type, id, onSendReplyComment }): ReactElement => {
  const history = useHistory();
  const [{ hasMore, comments, pageIndex }, setState] = useState<IState>({
    hasMore: true,
    comments: [],
    pageIndex: 1,
  });

  const goToPersonalCenter = useCallback((id?: number) => {
    if (!id) return;
    history.push('/client/personalcenter/' + id);
    // window.open('/client/personalcenter/' + id);
  }, []);

  useEffect(() => {
    if (pageIndex === 2 && comments.length < 10)
      setState(state => ({
        ...state,
        hasMore: false,
      }));
  }, [comments, pageIndex]);

  const loadData = useCallback(async () => {
    if (!id) return;
    const newComments = await api.getCommentsById(type, id, pageIndex, 10);
    const empty = isEmpty(newComments);
    setState(state => ({
      ...state,
      hasMore: empty ? false : true,
      comments: [
        ...comments,
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
      className="comment-scroll"
      dataLength={comments!.length}
      next={loadData}
      hasMore={hasMore}
      loader={<Skeleton avatar active />}
      endMessage={<Empty text="暂无更多评论..." />}
    >
      <If
        flag={comments!.length === 0}
        element2={
          <List
            className="comment"
            itemLayout="horizontal"
            dataSource={comments}
            size="small"
            renderItem={comment => (
              <li>
                <_Comment
                  className="comment-item"
                  actions={[
                    <span key="comment-basic-reply-to" onClick={() => openReplyForm(comment.id)}>
                      回复Ta
                    </span>,
                    <If
                      flag={comment.replyCount > 0 && !comment.open}
                      element1={
                        <a className="open-reply" onClick={() => openReply(comment.id)}>
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
                        onSendReplyComment={onSendReplyComment}
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
                      btnText="回复"
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
