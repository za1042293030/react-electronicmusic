import { IComment } from '@/common/typings';
import { Avatar, If } from '@/components';
import api from '@/services';
import { List, Comment, Skeleton, Popconfirm } from 'antd';
import moment from 'moment';
import React, { FC, memo, ReactElement, useEffect, useState } from 'react';
import ReplyForm from '../ReplyForm';
import { IProps, IState } from './interface';
import './index.less';
import { useUserInfo } from '@/hooks';

const SubComment: FC<IProps> = ({
                                  id,
                                  goToPersonalCenter,
                                  subReplyLoading,
                                  onSendSubReplyComment,
                                  onDeleteComment,
                                }): ReactElement => {
  const [{ pageIndex, comments, total, loading }, setState] = useState<IState>({
    pageIndex: 1,
    comments: [],
    total: 0,
    loading: true,
  });

  const { id: userId } = useUserInfo();

  const loadData = async (pageIn?: number) => {
    setState(state => ({
      ...state,
      loading: true,
    }));
    const res = await api.getSubCommentsById(id, pageIn ?? pageIndex, 5);
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
      element1={<Skeleton avatar active />}
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
          itemLayout='horizontal'
          dataSource={comments}
          size='small'
          renderItem={reply => (
            <li key={reply.id}>
              <Comment
                className='sub-comment'
                actions={[
                  <span key='comment-basic-reply-to' onClick={() => openReplyForm(reply.id)}>
                    ??????Ta
                  </span>,
                  <If flag={userId === reply.createBy.id}
                      element1={
                        <Popconfirm
                          title='??????????????????'
                          okText='??????'
                          cancelText='??????'
                          onConfirm={async () => {
                            if (onDeleteComment) {
                              await onDeleteComment(reply.id);
                              setState(state => ({
                                ...state,
                                pageIndex: 1,
                                comments: [],
                              }));
                              loadData(1);
                            }
                          }}
                        >
                          <span>??????</span>
                        </Popconfirm>
                      } />,
                ]}
                avatar={
                  <Avatar
                    imgSrc={reply.createBy?.avatar}
                    size={2.4}
                    onClick={() => goToPersonalCenter && goToPersonalCenter(reply.createBy?.id)}
                  />
                }
                author={reply.createBy?.nickName}
                content={
                  <p className='reply-content'>
                    {reply.replyTo ? (
                      <>
                        ??????
                        <a
                          className='reply-name'
                          onClick={() =>
                            goToPersonalCenter && goToPersonalCenter(reply.replyTo?.id)
                          }
                        >
                          @{reply.replyTo?.nickName}
                        </a>
                        ???{reply.content}
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
                    placeholder={'??????@' + reply?.createBy.nickName + '???'}
                    onSendComment={async value =>
                      onSendSubReplyComment && (await onSendSubReplyComment(value, reply.id))

                    }
                    submitLoading={subReplyLoading}
                    btnText='??????'
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
