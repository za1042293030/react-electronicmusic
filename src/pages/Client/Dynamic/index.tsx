import { CommentType } from '@/common/enums';
import { IDynamicWithComment, IParams, IRouterProps } from '@/common/typings';
import { DynamicCard, If } from '@/components';
import { useComment, usePlayList, useSetTitle } from '@/hooks';
import api from '@/services';
import { LeftOutlined } from '@ant-design/icons';
import { Skeleton } from 'antd';
import React, { FC, ReactElement, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import './index.less';

interface IState {
  dynamic: IDynamicWithComment | Record<string, any>;
  loading: boolean;
}

const PersonalCenter: FC<IRouterProps<IParams>> = ({
  route,
  match: {
    params: { id },
  },
}): ReactElement => {
  useSetTitle(route.meta?.title!);
  const history = useHistory();
  const { addPlayList } = usePlayList();

  const [{ dynamic, loading }, setState] = useState<IState>({
    dynamic: {},
    loading: false,
  });
  const { sendComment, sendReplyComment } = useComment(CommentType.DYNAMIC, parseInt(id));

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
        dynamic: dynamic ?? {},
      }));
    })();
  }, []);

  return (
    <div className="dynamic-detail">
      <main className="main">
        <div className="dynamic-detail-container">
          <div className="dynamic-card-container">
            <div className="back" title="后退" onClick={back}>
              <LeftOutlined style={{ fontSize: '2rem' }} />
              <span className="back-text">后退</span>
            </div>
            <If
              flag={loading}
              element1={<Skeleton avatar active />}
              element2={
                <DynamicCard
                  openComment
                  {...(dynamic as IDynamicWithComment)}
                  onSendComment={sendComment}
                  onSendReplyComment={sendReplyComment}
                  onClickSong={addPlayList}
                  id={parseInt(id)}
                />
              }
            />
          </div>
        </div>
      </main>
    </div>
  );
};
export default PersonalCenter;
