import { IParams, IRouterProps, ISongSimple, IStyle, IPlayList } from '@/common/typings';
import { If, MusicCard, Comment, ReplyForm, Loading, For } from '@/components';
import { useComment, usePlayList, useSetTitle } from '@/hooks';
import api from '@/services';
import { List, Tag } from 'antd';
import moment from 'moment';
import React, { FC, ReactElement, useEffect, useState } from 'react';
import './index.less';
import DefaultImg from '@/assets/emptyImg.webp';
import { CommentType } from '@/common/enums';
import { XS_CWIDTH } from '@/common/constants';
import { Link, useHistory } from 'react-router-dom';
import DedaultImg from '@/assets/emptyImg.webp';

interface IState {
  loading: boolean;
  playlist: IPlayList | undefined;
}

const PlayList: FC<IRouterProps<IParams>> = ({
  route,
  match: {
    params: { id },
  },
}): ReactElement => {
  useSetTitle(route.meta?.title);
  const [{ loading, playlist }, setState] = useState<IState>({
    loading: false,
    playlist: undefined,
  });
  const { addPlayList } = usePlayList();
  const { sendComment, sendReplyComment } = useComment(CommentType.PLAYLIST, playlist?.id);
  const history = useHistory();

  useEffect(() => {
    (async () => {
      setState(state => ({
        ...state,
        loading: true,
      }));
      const playlist = await api.getPlayListsById(parseInt(id));
      setState(state => ({
        ...state,
        playlist: playlist ?? undefined,
        loading: false,
      }));
    })();
  }, []);

  return (
    <div className="playlist">
      <main className="main">
        <div className="playlist-detail-container">
          <If
            flag={loading}
            element1={<Loading />}
            element2={
              <div className="playlist-detail-container-musiccard">
                <MusicCard src={playlist?.cover ?? DedaultImg} row playBtn={false}>
                  <div className="playlist-card-right transition-2">
                    <h1 className="playlist-card-name">{playlist?.name}</h1>
                    <If
                      flag={!playlist?.styles || document.documentElement.clientWidth <= XS_CWIDTH}
                      element2={
                        <div className="playlist-card-right-tag-box">
                          <For data={playlist?.styles!}>
                            {(style: IStyle) => <Tag>{style.name}</Tag>}
                          </For>
                        </div>
                      }
                    />
                    <div className="playlist-card-describe">
                      <p>{playlist?.describe ?? '暂无介绍'}</p>
                    </div>
                    <div className="playlist-card-right-bottom">
                      <p className="playlist-card-right-bottom-artist">
                        创建者：
                        <Link to={'/client/personalcenter/' + playlist?.createBy.id}>
                          {playlist?.createBy.nickName}
                        </Link>
                      </p>
                      <p className="playlist-card-right-bottom-time">
                        时间：{moment(playlist?.createTime).format('YYYY年MMMDo')}
                      </p>
                    </div>
                  </div>
                </MusicCard>
              </div>
            }
          />
          <If
            flag={!playlist?.songs}
            element2={
              <List
                size="small"
                header={<div className="playlist-song-list-header">歌曲：</div>}
                className="playlist-song-list"
                dataSource={playlist?.songs}
                renderItem={(song: ISongSimple) => (
                  <li className="playlist-song-list-item">
                    <MusicCard
                      height={6}
                      imgWidth={6}
                      row
                      src={song?.cover ?? DefaultImg}
                      style={{ cursor: 'pointer' }}
                      fileSrc={song?.file}
                      onClick={() => addPlayList(song)}
                    >
                      <div
                        className="card-child"
                        onClick={() => {
                          history.push('/client/song/' + song.id);
                        }}
                        title="点击前往歌曲详情页"
                      >
                        <p>
                          {song?.name}
                          <span>{song?.artists?.map(artist => artist.nickName).join(',')}</span>
                        </p>
                      </div>
                    </MusicCard>
                  </li>
                )}
              />
            }
          />
          <div className="playlist-comment-list">
            <div className="playlist-comment-list-text">评论({playlist?.commentCount})：</div>
            <div className="playlist-comment-reply">
              <ReplyForm onSendComment={sendComment} />
            </div>
            <Comment
              type={CommentType.PLAYLIST}
              id={playlist?.id}
              onSendReplyComment={sendReplyComment}
            />
          </div>
        </div>
      </main>
    </div>
  );
};
export default PlayList;
