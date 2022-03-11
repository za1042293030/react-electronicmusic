import { CommentType } from '@/common/enums';
import { IDynamicWithComment, IParams, IRouterProps } from '@/common/typings';
import { DynamicCard, If } from '@/components';
import { useComment, useHistoryScroll, usePlayList, useSetTitle } from '@/hooks';
import api from '@/services';
import { LeftOutlined } from '@ant-design/icons';
import { Skeleton } from 'antd';
import { isEmpty } from 'lodash';
import React, { FC, ReactElement, useEffect, useState } from 'react';
import './index.less';

interface IState {
  dynamic: IDynamicWithComment | undefined;
  loading: boolean;
  submitLoading: boolean;
  replyLoading: boolean;
  subReplyLoading: boolean;
}

const Dynamic: FC<IRouterProps<IParams>> = ({
                                              route,
                                              match: {
                                                params: { id },
                                              },
                                              history,
                                            }): ReactElement => {
  useSetTitle(route.meta?.title!);
  const { addPlayList } = usePlayList();
  const { push } = useHistoryScroll();

  const [{ dynamic, loading, submitLoading, replyLoading, subReplyLoading }, setState] =
    useState<IState>({
      dynamic: undefined,
      loading: true,
      submitLoading: false,
      replyLoading: false,
      subReplyLoading: false,
    });
  const {
    sendComment,
    sendReplyComment,
    deleteComment,
  } = useComment(CommentType.DYNAMIC, parseInt(id));

  const back = () => {
    history.goBack();
  };

  useEffect(() => {
    (async () => {
      setState(state => ({
        ...state,
        loading: true,
      }));
      const dynamic = await api.getDynamicById(parseInt(id));
      setState(state => ({
        ...state,
        loading: false,
        dynamic: dynamic ?? undefined,
      }));
    })();
  }, []);

  useEffect(() => {
    if (!loading && isEmpty(dynamic)) push('/404');
  }, [dynamic, loading]);

  return (
    <div className='dynamic-detail'>
      <main className='main'>
        <div className='dynamic-detail-container'>
          <div className='dynamic-card-container common-shadow'>
            <div className='back' title='后退' onClick={back}>
              <LeftOutlined style={{ fontSize: '2rem' }} />
              <span className='back-text'>后退</span>
            </div>
            <If
              flag={loading}
              element1={<Skeleton avatar active />}
              element2={
                <DynamicCard
                  openComment
                  {...(dynamic as IDynamicWithComment)}
                  onDeleteComment={deleteComment}
                  onSendComment={async value => {
                    setState(state => ({
                      ...state,
                      submitLoading: true,
                    }));
                    await sendComment(value);
                    setState(state => ({
                      ...state,
                      submitLoading: false,
                    }));
                  }}
                  onSendReplyComment={async (value, commentId) => {
                    if (!value) return;
                    setState(state => ({
                      ...state,
                      replyLoading: true,
                    }));
                    await sendReplyComment(value, commentId);
                    setState(state => ({
                      ...state,
                      replyLoading: false,
                    }));
                  }}
                  onSendSubReplyComment={async (value, commentId) => {
                    if (!value) return;
                    setState(state => ({
                      ...state,
                      subReplyLoading: true,
                    }));
                    await sendReplyComment(value, commentId);
                    setState(state => ({
                      ...state,
                      subReplyLoading: false,
                    }));
                  }}
                  onClickSong={addPlayList}
                  id={parseInt(id)}
                  submitLoading={submitLoading}
                  replyLoading={replyLoading}
                  subReplyLoading={subReplyLoading}
                />
              }
            />
          </div>
        </div>
      </main>
    </div>
  );
};
export default Dynamic;
