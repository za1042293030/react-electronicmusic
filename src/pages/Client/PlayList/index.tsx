import { IParams, IRouterProps, ISongSimple, IStyle, IPlayList } from '@/common/typings';
import { If, MusicCard, Comment, ReplyForm, For } from '@/components';
import { useComment, useHistoryScroll, usePlayList, useSetTitle, useUserInfo } from '@/hooks';
import api from '@/services';
import { List, message, PageHeader, Popconfirm, Skeleton, Tag, Tooltip } from 'antd';
import moment from 'moment';
import React, { FC, ReactElement, useEffect, useState } from 'react';
import './index.less';
import DefaultImg from '@/assets/emptyImg.webp';
import { CommentType } from '@/common/enums';
import { MD_CWIDTH, XS_CWIDTH } from '@/common/constants';
import { Link } from 'react-router-dom';
import { isEmpty } from 'lodash';
import { CloseOutlined } from '@ant-design/icons';

interface IState {
  loading: boolean;
  playlist: IPlayList | undefined;
  songLoading: boolean;
}

const PlayList: FC<IRouterProps<IParams>> = ({
  route,
  match: {
    params: { id },
  },
  history,
}): ReactElement => {
  const [{ loading, playlist, songLoading }, setState] = useState<IState>({
    loading: true,
    playlist: undefined,
    songLoading: false,
  });
  console.log(playlist);
  useSetTitle((playlist?.name ?? '') + '_' + route.meta?.title, [playlist]);
  const { addPlayList } = usePlayList();
  const { sendComment, sendReplyComment, deleteComment } = useComment(
    CommentType.PLAYLIST,
    playlist?.id
  );
  const { push } = useHistoryScroll();
  const { id: userId, isLogin } = useUserInfo();

  const loadPlayListData = async () => {
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
  };
  useEffect(() => {
    loadPlayListData();
  }, [id]);

  useEffect(() => {
    if (!loading && isEmpty(playlist)) push('/404');
  }, [playlist, loading]);

  const onPlayListSongDelete = async (songId: number) => {
    if (!songId || !playlist) return;
    message.loading({
      content: '?????????????????????',
      key: 3,
    });
    setState(state => ({
      ...state,
      songLoading: true,
    }));
    const flag = await api.deletePlayListSong({
      songId,
      playListId: playlist.id,
    });
    setState(state => ({
      ...state,
      songLoading: false,
    }));
    message.destroy(3);
    if (flag) {
      loadPlayListData();
      message.success('????????????');
    } else if (flag === false) message.error('????????????');
  };
  const cWidth = document.documentElement.clientWidth;

  return (
    <div className="playlist">
      <main className="main">
        <div className="playlist-detail-container">
          <PageHeader
            ghost={false}
            onBack={history.goBack}
            title={playlist?.name ?? ''}
            subTitle={'????????????' + playlist?.createBy.nickName ?? ''}
            style={{ marginBottom: '1rem', padding: '.5rem 1rem' }}
            className="common-shadow"
          />
          <If
            flag={loading}
            element1={<Skeleton active />}
            element2={
              <div className="playlist-detail-container-musiccard common-shadow">
                <MusicCard
                  src={playlist?.cover ?? DefaultImg}
                  row
                  playBtn={false}
                  imgWidth={cWidth >= MD_CWIDTH ? 25 : cWidth >= XS_CWIDTH ? 20 : 12}
                >
                  <div className="playlist-card-right transition-2">
                    <h1 className="playlist-card-name">{playlist?.name}</h1>
                    <If
                      flag={!playlist?.styles || document.documentElement.clientWidth <= XS_CWIDTH}
                      element2={
                        <div className="playlist-card-right-tag-box">
                          <For data={playlist?.styles!} emptyEl={false}>
                            {(style: IStyle) => <Tag key={style.id}>{style.name}</Tag>}
                          </For>
                        </div>
                      }
                    />
                    <div className="playlist-card-describe">
                      <p>{playlist?.describe ?? '????????????'}</p>
                    </div>
                    <div className="playlist-card-right-bottom">
                      <p className="playlist-card-right-bottom-artist">
                        ????????????
                        <Link to={'/client/personalcenter/' + playlist?.createBy.id}>
                          {playlist?.createBy.nickName}
                        </Link>
                      </p>
                      <p className="playlist-card-right-bottom-time">
                        {moment(playlist?.createTime).format('YYYY???MMMDo')}
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
                header={<div className="playlist-song-list-header">?????????</div>}
                className="playlist-song-list common-shadow"
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
                          push('/client/song/' + song.id);
                        }}
                        title="???????????????????????????"
                      >
                        <Tooltip
                          title={
                            '?????????' +
                            (song?.name ?? '') +
                            ' ????????????' +
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
                    <If
                      flag={userId === playlist?.createBy.id}
                      element1={
                        <Popconfirm
                          title="?????????????????????"
                          onConfirm={() => onPlayListSongDelete(song.id)}
                          okText="??????"
                          cancelText="??????"
                          okButtonProps={{ loading: songLoading }}
                        >
                          <span className="playlist-song-del">
                            <CloseOutlined title="??????????????????" />
                          </span>
                        </Popconfirm>
                      }
                    />
                  </li>
                )}
              />
            }
          />
          <div className="playlist-comment-list common-shadow">
            <div className="playlist-comment-list-text">??????({playlist?.commentedCount})???</div>
            <If
              flag={isLogin}
              element1={
                <div className="playlist-comment-reply">
                  <ReplyForm onSendComment={sendComment} />
                </div>
              }
            />
            <Comment
              type={CommentType.PLAYLIST}
              id={playlist?.id}
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
export default PlayList;
