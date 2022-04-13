import { IAlbum, IParams, IRouterProps, ISongSimple, IStyle } from '@/common/typings';
import { If, MusicCard, Comment, ReplyForm, For } from '@/components';
import { useComment, useHistoryScroll, usePlayList, useSetTitle, useUserInfo } from '@/hooks';
import api from '@/services';
import { List, PageHeader, Skeleton, Tag, Tooltip } from 'antd';
import moment from 'moment';
import React, { FC, ReactElement, useEffect, useState } from 'react';
import './index.less';
import DefaultImg from '@/assets/emptyImg.webp';
import { CommentType } from '@/common/enums';
import { XS_CWIDTH } from '@/common/constants';
import { Link } from 'react-router-dom';
import { isEmpty } from 'lodash';

interface IState {
  loading: boolean;
  album: IAlbum | undefined;
}

const Album: FC<IRouterProps<IParams>> = ({
  route,
  match: {
    params: { id },
  },
  history,
}): ReactElement => {
  const [{ loading, album }, setState] = useState<IState>({
    loading: true,
    album: undefined,
  });
  useSetTitle((album?.name ?? '') + '_' + route.meta?.title, [album]);
  const { addPlayList } = usePlayList();
  const { sendComment, sendReplyComment, deleteComment } = useComment(CommentType.ALBUM, album?.id);
  const { push } = useHistoryScroll();
  const { isLogin } = useUserInfo();

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

  useEffect(() => {
    if (!loading && isEmpty(album)) push('/404');
  }, [album, loading]);

  return (
    <div className="album">
      <main className="main">
        <div className="album-detail-container">
          <PageHeader
            ghost={false}
            onBack={history.goBack}
            title={album?.name ?? ''}
            subTitle={'制作人：' + album?.artists.map(artist => artist.nickName).join(',') ?? ''}
            style={{ marginBottom: '1rem', padding: '.5rem 1rem' }}
            className="common-shadow"
          />
          <If
            flag={loading}
            element1={<Skeleton active />}
            element2={
              <div className="album-detail-container-musiccard common-shadow">
                <MusicCard src={album?.cover} row playBtn={false}>
                  <div className="album-card-right transition-2">
                    <p className="album-card-name">{album?.name}</p>
                    <If
                      flag={!album?.styles || document.documentElement.clientWidth <= XS_CWIDTH}
                      element2={
                        <div className="album-card-right-tag-box">
                          <For data={album?.styles!} emptyEl={false}>
                            {(style: IStyle) => <Tag key={style.id}>{style.name}</Tag>}
                          </For>
                        </div>
                      }
                    />
                    <div className="album-card-describe">
                      <p>{album?.describe ?? '暂无介绍'}</p>
                    </div>
                    <div className="album-card-right-bottom">
                      <p className="album-card-right-bottom-artist">
                        创建人：
                        <For data={album?.artists ?? []} emptyEl={false}>
                          {artist => (
                            <Tag color="green" key={artist.id}>
                              <Link to={'/client/personalcenter/' + artist.id}>
                                {artist.nickName}
                              </Link>
                            </Tag>
                          )}
                        </For>
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
                className="album-song-list common-shadow"
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
                          push('/client/song/' + song.id);
                        }}
                        title="点击前往歌曲详情页"
                      >
                        <Tooltip
                          title={
                            '曲名：' +
                            (song?.name ?? '') +
                            ' 制作人：' +
                            song?.artists?.map(artist => artist?.nickName).join(',')
                          }
                        >
                          <p>
                            {song?.name}
                            <span>{song?.artists?.map(artist => artist?.nickName).join(',')}</span>
                          </p>
                        </Tooltip>
                      </div>
                    </MusicCard>
                  </li>
                )}
              />
            }
          />
          <div className="album-comment-list common-shadow">
            <div className="album-comment-list-text">评论({album?.commentedCount})：</div>
            <If
              flag={isLogin}
              element1={
                <div className="album-comment-reply">
                  <ReplyForm onSendComment={sendComment} />
                </div>
              }
            />
            <Comment
              type={CommentType.ALBUM}
              id={album?.id}
              onSendSubReplyComment={sendReplyComment}
              onSendReplyComment={sendReplyComment}
              onDeleteComment={deleteComment}
            />
          </div>
        </div>
      </main>
    </div>
  );
};
export default Album;
