import { IAlbum, IParams, IRouterProps, ISongSimple, IStyle } from '@/common/typings';
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

interface IState {
  loading: boolean;
  album: IAlbum | undefined;
}

const Album: FC<IRouterProps<IParams>> = ({
  route,
  match: {
    params: { id },
  },
}): ReactElement => {
  useSetTitle(route.meta?.title);
  const [{ loading, album }, setState] = useState<IState>({
    loading: false,
    album: undefined,
  });
  const { addPlayList } = usePlayList();
  const { sendComment, sendReplyComment } = useComment(CommentType.ALBUM, album?.id);
  const history = useHistory();

  useEffect(() => {
    (async () => {
      setState(state => ({
        ...state,
        loading: true,
      }));
      const album = await api.getAlbumById(parseInt(id));
      setState(state => ({
        ...state,
        album: album ?? undefined,
        loading: false,
      }));
    })();
  }, []);

  return (
    <div className="album">
      <main className="main">
        <div className="album-detail-container">
          <If
            flag={loading}
            element1={<Loading />}
            element2={
              <div className="album-detail-container-musiccard">
                <MusicCard src={album?.cover} row playBtn={false}>
                  <div className="album-card-right transition-2">
                    <h1 className="album-card-name">{album?.name}</h1>
                    <If
                      flag={!album?.styles || document.documentElement.clientWidth <= XS_CWIDTH}
                      element2={
                        <div className="album-card-right-tag-box">
                          <For data={album?.styles!}>
                            {(style: IStyle) => <Tag>{style.name}</Tag>}
                          </For>
                        </div>
                      }
                    />
                    <div className="album-card-describe">
                      <p>{album?.describe ?? '暂无介绍'}</p>
                    </div>
                    <div className="album-card-right-bottom">
                      <p className="album-card-right-bottom-artist">
                        制作人：
                        {album?.artists.map(artist => (
                          <Tag color="green">
                            <Link to={'/client/personalcenter/' + artist.id}>
                              {artist.nickName}
                            </Link>
                          </Tag>
                        ))}
                      </p>
                      <p className="album-card-right-bottom-time">
                        时间：{moment(album?.createTime).format('YYYY年MMMDo')}
                      </p>
                    </div>
                  </div>
                </MusicCard>
              </div>
            }
          />
          <If
            flag={!album?.songs}
            element2={
              <List
                size="small"
                header={<div className="album-song-list-header">歌曲：</div>}
                className="album-song-list"
                dataSource={album?.songs}
                renderItem={(song: ISongSimple) => (
                  <li className="album-song-list-item">
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
          <div className="album-comment-list">
            <div className="album-comment-list-text">评论({album?.commentCount})：</div>
            <div className="album-comment-reply">
              <ReplyForm onSendComment={sendComment} />
            </div>
            <Comment
              type={CommentType.ALBUM}
              id={album?.id}
              onSendReplyComment={sendReplyComment}
            />
          </div>
        </div>
      </main>
    </div>
  );
};
export default Album;
