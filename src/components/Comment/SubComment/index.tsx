import { IComment } from '@/common/typings';
import { Avatar, If, Loading } from '@/components';
import api from '@/services';
import { List, Comment } from 'antd';
import moment from 'moment';
import React, { FC, memo, ReactElement, useEffect, useState } from 'react';
import ReplyForm from '../ReplyForm';
import { IProps, IState } from './interface';

const SubComment: FC<IProps> = ({ id, goToPersonalCenter, onSendReplyComment }): ReactElement => {
  const [{ pageIndex, comments, total, loading }, setState] = useState<IState>({
    pageIndex: 1,
    comments: [],
    total: 0,
    loading: true,
  });

  const loadData = async () => {
    setState(state => ({
      ...state,
      loading: true,
    }));
    const res = await api.getSubCommentsById(id, pageIndex, 5);
    if (res)
      setState(state => ({
        ...state,
        loading: false,
        comments: res.data as IComment[],
        total: res.totalCount,
      }));
  };

  const onChange = (page: number) => {
    setState(state => ({
      ...state,
      pageIndex: page,
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

  useEffect(() => {
    loadData();
  }, [pageIndex]);

  return (
    <If
      flag={loading}
      element1={<Loading />}
      element2={
        <List
          pagination={{
            onChange,
            size: 'small',
            current: pageIndex,
            total,
            pageSize: 5,
            position: 'bottom',
          }}
          itemLayout="horizontal"
          dataSource={comments}
          size="small"
          renderItem={reply => (
            <li>
              <Comment
                actions={[
                  <span key="comment-basic-reply-to" onClick={() => openReplyForm(reply.id)}>
                    回复Ta
                  </span>,
                ]}
                avatar={
                  <Avatar
                    imgSrc={reply.createBy?.avatar}
                    size={2.8}
                    onClick={() => goToPersonalCenter && goToPersonalCenter(reply.createBy?.id)}
                  />
                }
                author={reply.createBy?.nickName}
                content={
                  <p className="reply-content">
                    {reply.replyTo ? (
                      <>
                        回复
                        <a
                          className="reply-name"
                          onClick={() =>
                            goToPersonalCenter && goToPersonalCenter(reply.replyTo?.id)
                          }
                        >
                          @{reply.replyTo?.nickName}
                        </a>
                        ：{reply.content}
                      </>
                    ) : (
                      reply.content
                    )}
                  </p>
                }
                datetime={moment(reply.createTime).utcOffset(8).fromNow()}
              />
              <If
                flag={reply.openReplyForm}
                element1={
                  <ReplyForm
                    onSendComment={value =>
                      onSendReplyComment && onSendReplyComment(value, reply.id)
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
  );
};
export default memo(SubComment);
