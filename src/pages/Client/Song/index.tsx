import { IParams, IRouterProps, ISong, IStyle } from '@/common/typings';
import { If, MusicCard, Comment, ReplyForm, Loading, For } from '@/components';
import { useComment, usePlayList, useSetTitle } from '@/hooks';
import api from '@/services';
import { Tag } from 'antd';
import moment from 'moment';
import React, { FC, ReactElement, useEffect, useState } from 'react';
import './index.less';
import { CommentType } from '@/common/enums';
import { XS_CWIDTH } from '@/common/constants';
import { Link } from 'react-router-dom';

interface IState {
  loading: boolean;
  song: ISong | undefined;
}

const Song: FC<IRouterProps<IParams>> = ({
  route,
  match: {
    params: { id },
  },
}): ReactElement => {
  const [{ loading, song }, setState] = useState<IState>({
    loading: false,
    song: undefined,
  });
  useSetTitle(route.meta?.title);
  const { addPlayList } = usePlayList();
  const { sendComment, sendReplyComment } = useComment(CommentType.SONG, song?.id);

  useEffect(() => {
    (async () => {
      setState(state => ({
        ...state,
        loading: true,
      }));
      const song = await api.getSongById(parseInt(id));
      setState(state => ({
        ...state,
        song: song ?? undefined,
        loading: false,
      }));
    })();
  }, []);

  return (
    <div className="song">
      <main className="main">
        <div className="song-detail-container">
          <If
            flag={loading}
            element1={<Loading />}
            element2={
              <div className="song-detail-container-musiccard">
                <MusicCard src={song?.cover} row onClick={() => song && addPlayList(song)}>
                  <div className="song-card-right transition-2">
                    <h1 className="song-card-name">{song?.name}</h1>
                    <If
                      flag={!song?.styles || document.documentElement.clientWidth <= XS_CWIDTH}
                      element2={
                        <div className="song-card-right-tag-box">
                          <For data={song?.styles!}>
                            {(style: IStyle) => <Tag>{style.name}</Tag>}
                          </For>
                        </div>
                      }
                    />
                    <div className="song-card-describe">
                      <p>{song?.describe ?? '暂无介绍'}</p>
                    </div>
                    <div className="song-card-right-bottom">
                      <p className="song-card-right-bottom-artist">
                        制作人：
                        {song?.artists.map(artist => (
                          <Tag color="green">
                            <Link to={'/client/personalcenter/' + artist.id}>
                              {artist.nickName}
                            </Link>
                          </Tag>
                        ))}
                      </p>
                      <p className="song-card-right-bottom-time">
                        时间：{moment(song?.createTime).format('YYYY年MMMDo')}
                      </p>
                    </div>
                  </div>
                </MusicCard>
              </div>
            }
          />
          <div className="song-comment-list">
            <div className="song-comment-list-text">评论({song?.commentCount})：</div>
            <div className="song-comment-reply">
              <ReplyForm onSendComment={sendComment} />
            </div>
            <Comment type={CommentType.SONG} id={song?.id} onSendReplyComment={sendReplyComment} />
          </div>
        </div>
      </main>
    </div>
  );
};
export default Song;
