import { IParams, IPlayListSimple, IRouterProps, ISong, IStyle } from '@/common/typings';
import { If, MusicCard, Comment, ReplyForm, For } from '@/components';
import {
  useComment,
  useDidUpdateEffect,
  useHistoryScroll,
  usePlayList,
  useSetTitle,
  useUserInfo,
} from '@/hooks';
import api from '@/services';
import { message, Modal, PageHeader, Skeleton, Tag } from 'antd';
import moment from 'moment';
import React, { FC, ReactElement, useEffect, useState } from 'react';
import './index.less';
import { CommentType } from '@/common/enums';
import { XS_CWIDTH } from '@/common/constants';
import { Link, useHistory } from 'react-router-dom';
import { isEmpty } from 'lodash';
import { PlusOutlined } from '@ant-design/icons';
import DefaultImg from '@/assets/emptyImg.webp';
import InfiniteScroll from 'react-infinite-scroll-component';

interface IState {
  loading: boolean;
  song: ISong | undefined;
  isModalVisible: boolean;
  playListLoading: boolean;
  pageIndex: number;
  pageSize: number;
  playlists: IPlayListSimple[];
  hasMore: boolean;
}

const Song: FC<IRouterProps<IParams>> = ({
  route,
  match: {
    params: { id },
  },
}): ReactElement => {
  const [{ loading, song, isModalVisible, pageIndex, pageSize, playlists, hasMore }, setState] =
    useState<IState>({
      loading: true,
      song: undefined,
      isModalVisible: false,
      playListLoading: false,
      pageIndex: 1,
      pageSize: 5,
      playlists: [],
      hasMore: true,
    });
  useSetTitle((song?.name ?? '') + '_' + route.meta?.title, [song]);
  const { addPlayList } = usePlayList();
  const { sendComment, sendReplyComment, deleteComment } = useComment(CommentType.SONG, song?.id);
  const history = useHistory();
  const { push } = useHistoryScroll();
  const { isLogin, id: userId } = useUserInfo();

  const loadData = async () => {
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
  };

  const loadPlayList = async () => {
    setState(state => ({
      ...state,
      playListLoading: true,
    }));
    const newPlayLists = await api.getPlayListsByUserId(userId, pageIndex, pageSize);
    const empty = isEmpty(newPlayLists);
    setState(state => ({
      ...state,
      hasMore: empty || (newPlayLists && newPlayLists?.length < pageSize) ? false : true,
      playlists: [
        ...state.playlists,
        ...(!empty
          ? (newPlayLists?.map(newPlayList => ({
              ...newPlayList,
              playListPopVisible: false,
            })) as IPlayListSimple[])
          : []),
      ],
      playListLoading: false,
      pageIndex: empty ? state.pageIndex : state.pageIndex + 1,
    }));
  };

  useEffect(() => {
    loadData();
  }, [id]);

  useDidUpdateEffect(() => {
    if (isModalVisible) loadPlayList();
  }, [userId, isModalVisible]);

  useEffect(() => {
    if (!loading && isEmpty(song)) push('/404');
  }, [song, loading]);

  const addSongToPlayList = async (playListId: number) => {
    message.loading({
      content: '?????????????????????',
      key: 2,
    });
    if (!playListId) return;
    const flag = await api.addSongToPlayList({
      songId: parseInt(id),
      playListId,
    });
    message.destroy(2);
    if (flag) {
      message.success('????????????');
    } else if (flag === false) message.error('????????????');
  };

  return (
    <div className="song">
      <main className="main">
        <div className="song-detail-container">
          <PageHeader
            ghost={false}
            onBack={history.goBack}
            title={song?.name ?? ''}
            subTitle={'????????????' + song?.artists.map(artist => artist.nickName).join(',') ?? ''}
            style={{ marginBottom: '1rem', padding: '.5rem 1rem' }}
            className="common-shadow"
          />
          <If
            flag={loading}
            element1={<Skeleton active />}
            element2={
              <div className="song-detail-container-musiccard common-shadow">
                <MusicCard src={song?.cover} row onClick={() => song && addPlayList(song)}>
                  <div className="song-card-right transition-2">
                    <p className="song-card-name">{song?.name}</p>
                    <If
                      flag={!song?.styles || document.documentElement.clientWidth <= XS_CWIDTH}
                      element2={
                        <div className="song-card-right-tag-box">
                          <For data={song?.styles!} emptyEl={false}>
                            {(style: IStyle) => <Tag key={style.id}>{style.name}</Tag>}
                          </For>
                        </div>
                      }
                    />
                    <div className="song-card-describe">
                      <p>{song?.describe ?? '????????????'}</p>
                    </div>
                    <div className="song-card-right-bottom">
                      <p className="song-card-right-bottom-artist">
                        ????????????
                        <For data={song?.artists ?? []} emptyEl={false}>
                          {artist => (
                            <Tag color="green" key={artist.id}>
                              <Link to={'/client/personalcenter/' + artist.id}>
                                {artist.nickName}
                              </Link>
                            </Tag>
                          )}
                        </For>
                      </p>
                      <p className="song-card-right-bottom-time">
                        ?????????{moment(song?.createTime).format('YYYY???MMMDo')}
                      </p>
                    </div>
                  </div>
                </MusicCard>
              </div>
            }
          />
          <div className="song-comment-list common-shadow">
            <div className="song-comment-list-text">
              ??????({song?.commentedCount})???
              <If
                flag={isLogin}
                element1={
                  <>
                    <p className="song-actions">
                      <PlusOutlined
                        title="?????????????????????"
                        onClick={() =>
                          setState(state => ({
                            ...state,
                            isModalVisible: true,
                          }))
                        }
                      />
                    </p>
                    <Modal
                      title="??????????????????"
                      visible={isModalVisible}
                      onCancel={() =>
                        setState(state => ({
                          ...state,
                          isModalVisible: false,
                        }))
                      }
                      footer={null}
                    >
                      <div id="playlist-inscroll">
                        <InfiniteScroll
                          dataLength={playlists.length}
                          next={loadPlayList}
                          hasMore={hasMore}
                          loader={
                            <div style={{ padding: '0 1rem' }}>
                              <Skeleton avatar active />
                            </div>
                          }
                          scrollableTarget="playlist-inscroll"
                        >
                          <For data={playlists}>
                            {(playList: IPlayListSimple) => (
                              <div key={playList.id}>
                                <MusicCard
                                  src={playList?.cover ?? DefaultImg}
                                  row
                                  height={12}
                                  playBtn={false}
                                  onClick={() => addSongToPlayList(playList?.id)}
                                  imgWidth={12}
                                >
                                  <div className="playlist-card-bottom">
                                    <div className="playlist-card-info">
                                      <span className="playlist-name">{playList?.name}</span>
                                    </div>
                                    <div className="playlist-tag-container">
                                      <For data={playList?.styles} emptyEl={false}>
                                        {(style: IStyle) => (
                                          <Tag key={style.id} className="playlist-tag">
                                            {style.name}
                                          </Tag>
                                        )}
                                      </For>
                                    </div>
                                  </div>
                                </MusicCard>
                              </div>
                            )}
                          </For>
                        </InfiniteScroll>
                      </div>
                    </Modal>
                  </>
                }
              />
            </div>
            <If
              flag={isLogin}
              element1={
                <div className="song-comment-reply">
                  <ReplyForm onSendComment={sendComment} />
                </div>
              }
            />
            <Comment
              type={CommentType.SONG}
              id={song?.id}
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
export default Song;
