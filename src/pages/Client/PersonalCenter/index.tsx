import { BASE_URL, SM_CWIDTH, TOKEN } from '@/common/constants';
import {
  IChangePassword,
  ICreatePlayList,
  IDynamic,
  IParams,
  IPlayListSimple,
  IRouterProps, ISearchAlbum,
  IStyle,
  IUpdatePlayList,
  IUserInfo,
} from '@/common/typings';
import { Avatar, DynamicCard, Empty, For, If, Loading, MusicCard } from '@/components';
import { useHistoryScroll, usePlayList, useSetTitle, useSign, useUserInfo } from '@/hooks';
import api from '@/services';
import {
  Button,
  Divider,
  Skeleton,
  Tabs,
  Tag,
  Upload,
  Image,
  message,
  Form,
  Input,
  Popconfirm,
  Modal,
} from 'antd';
import { isEmpty } from 'lodash';
import React, { FC, ReactElement, useCallback, useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import './index.less';
import { PlusOutlined, UploadOutlined } from '@ant-design/icons';
import DefaultImg from '@/assets/emptyImg.webp';
import { passwordRule, playListDescribeRule, playListNameRule } from '@/common/constants/formRule';
import ImgCrop from 'antd-img-crop';

const { TabPane } = Tabs;

enum TabKey {
  MESSAGE = 'message',
  ALBUM = 'album',
  PLAYLIST = 'playlist',
  ARTIST = 'artist',
  DYNAMIC = 'dynamic',
}

interface IState {
  userInfo: IUserInfo | undefined;
  dynamics: IDynamic[];
  playlists: IPlayListSimple[];
  albums: ISearchAlbum[];
  hasMore: boolean;
  id: number;
  pageSize: number;
  tabKey: TabKey;
  tabPosition: 'left' | 'top';
  useInfoLoading: boolean;
  pageIndex: number;
  changePasswordLoading: boolean;
  isCreatePlayListModalVisible: boolean;
  playListLoading: boolean;
  editPlayList: IPlayListSimple | Record<string, any>;
  playListCoverId: number;
  dynamicLoading: boolean;
}

const PersonalCenter: FC<IRouterProps<IParams>> = ({
                                                     route,
                                                     match: {
                                                       params: { id: _id },
                                                     },
                                                   }): ReactElement => {
  const cWidth = document.documentElement.clientWidth;
  const { userInfo: _userInfo } = useUserInfo();
  const [
    {
      userInfo,
      dynamics,
      hasMore,
      id,
      pageSize,
      tabKey,
      tabPosition,
      useInfoLoading,
      playlists,
      pageIndex,
      changePasswordLoading,
      isCreatePlayListModalVisible,
      playListLoading,
      editPlayList,
      playListCoverId,
      dynamicLoading,
      albums,
    },
    setState,
  ] = useState<IState>({
    useInfoLoading: _userInfo?.id === parseInt(_id) ? false : true,
    userInfo: _userInfo?.id === parseInt(_id) ? _userInfo : {},
    dynamics: [],
    playlists: [],
    hasMore: true,
    id: parseInt(_id),
    pageSize: 10,
    tabKey: _userInfo?.id === parseInt(_id) ? TabKey.MESSAGE : TabKey.DYNAMIC,
    tabPosition: cWidth > SM_CWIDTH ? 'left' : 'top',
    pageIndex: 1,
    changePasswordLoading: false,
    isCreatePlayListModalVisible: false,
    playListLoading: false,
    editPlayList: {},
    playListCoverId: -1,
    dynamicLoading: false,
    albums: [],
  });
  useSetTitle(userInfo?.nickName + '_' + route.meta?.title!, [userInfo]);
  const { addPlayList } = usePlayList();
  const { changePassword, logOut } = useSign();
  const { push } = useHistoryScroll();

  const onChange = useCallback((key: string) => {
    setState(state => ({
      ...state,
      tabKey: key as TabKey,
    }));
  }, []);

  useEffect(() => {
    setState(state => ({
      ...state,
      hasMore: true,
      dynamics: [],
      playlists: [],
      albums: [],
      pageIndex: 1,
    }));
    const loadData = async () => {
      switch (tabKey) {
        case TabKey.DYNAMIC: {
          await loadDynamicsData(1);
          break;
        }
        case TabKey.PLAYLIST: {
          await loadPlayListData(1);
          break;
        }
        case TabKey.ALBUM: {
          await loadAlbumsData(1);
          break;
        }
        case TabKey.ARTIST: {
          push('/client/producer/' + _id);
          break;
        }
        default:
          break;
      }
    };
    loadData();
  }, [tabKey]);

  const loadUserInfo = async () => {
    if (!isEmpty(userInfo) || isNaN(id)) return;
    setState(state => ({
      ...state,
      useInfoLoading: true,
    }));
    const userInfoMsg = await api.getUserInfo(id);
    setState(state => ({
      ...state,
      userInfo: userInfoMsg ?? {},
      useInfoLoading: false,
    }));
  };

  useEffect(() => {
    if (!isEmpty(userInfo) || isNaN(id)) return;
    loadUserInfo();
  }, [id]);

  useEffect(() => {
    if (!useInfoLoading && isEmpty(userInfo)) push('/404');
  }, [userInfo, useInfoLoading]);

  useEffect(() => {
    setState(state => ({
      ...state,
      id: parseInt(_id),
      userInfo: _userInfo?.id === parseInt(_id) ? _userInfo : undefined,
      tabKey: _userInfo?.id === parseInt(_id) ? TabKey.MESSAGE : TabKey.DYNAMIC,
      useInfoLoading: _userInfo?.id === parseInt(_id) ? false : true,
    }));
  }, [_id]);

  const loadDynamicsData = useCallback(
    async (pageIn?: number) => {
      setState(state => ({
        ...state,
        loading: true,
      }));
      const newDynamics = await api.getDynamicByUserId(id, pageSize, pageIn ?? pageIndex);
      const empty = isEmpty(newDynamics);
      setState(state => ({
        ...state,
        hasMore: empty || (newDynamics && newDynamics?.length < pageSize) ? false : true,
        dynamics: [...state.dynamics, ...(!empty ? (newDynamics as IDynamic[]) : [])],
        loading: false,
        pageIndex: empty ? state.pageIndex : state.pageIndex + 1,
      }));
    },
    [id, pageIndex, pageSize],
  );

  const loadAlbumsData = useCallback(
    async (pageIn?: number) => {
      setState(state => ({
        ...state,
        loading: true,
      }));
      const newAlbums = await api.getAlbumByUserId(id, pageIn ?? pageIndex, pageSize);
      const empty = isEmpty(newAlbums);
      setState(state => ({
        ...state,
        hasMore: empty || (newAlbums && newAlbums?.length < pageSize) ? false : true,
        albums: [...state.albums, ...(!empty ? (newAlbums as ISearchAlbum[]) : [])],
        loading: false,
        pageIndex: empty ? state.pageIndex : state.pageIndex + 1,
      }));
    },
    [id, pageIndex, pageSize],
  );

  const onDynamicDelete = async (id: number) => {
    message.loading('删除中，请稍候');
    setState(state => ({
      ...state,
      dynamicLoading: true,
    }));
    const flag = await api.deleteDynamic({
      id,
    });
    setState(state => ({
      ...state,
      dynamicPopVisible: false,
      dynamicLoading: false,
      dynamics: [],
    }));
    message.destroy();
    if (flag) {
      setState(state => ({
        ...state,
        pageIndex: 1,
        hasMore: true,
        dynamics: [],
      }));
      loadDynamicsData(1);
      message.success('删除成功');
    } else message.error('删除失败');
  };

  const loadPlayListData = useCallback(
    async (pageIn?: number) => {
      setState(state => ({
        ...state,
        loading: true,
      }));
      const newPlayLists = await api.getPlayListsByUserId(id, pageIn ?? pageIndex, pageSize);
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
              isEditPlayListModalVisible: false,
            })) as IPlayListSimple[])
            : []),
        ],
        loading: false,
        pageIndex: empty ? state.pageIndex : state.pageIndex + 1,
      }));
    },
    [id, pageIndex, pageSize],
  );

  const onComment = useCallback((id: number) => {
    push('/client/dynamic/' + id);
  }, []);

  const onFinish = async (data: IChangePassword) => {
    setState(state => ({
      ...state,
      changePasswordLoading: true,
    }));
    await changePassword(data);
    setState(state => ({
      ...state,
      changePasswordLoading: false,
    }));
  };

  const createPlaylist = async (data: ICreatePlayList) => {
    if (!data?.name) return;
    message.loading('创建中，请稍候');
    setState(state => ({
      ...state,
      playListLoading: true,
    }));
    const flag = await api.createPlayList(data);
    message.destroy();
    setState(state => ({
      ...state,
      playListLoading: false,
    }));
    if (flag) {
      message.success('创建成功，审核马上就好');
      setState(state => ({
        ...state,
        isCreatePlayListModalVisible: false,
      }));
    } else message.error('创建失败');
  };

  const updatePlayList = async (data: IUpdatePlayList) => {
    const { name, describe } = data;
    if (!name && !describe && playListCoverId === -1) return;
    message.loading('修改中，请稍候');
    setState(state => ({
      ...state,
      playListLoading: true,
    }));
    const flag = await api.updatePlayList({
      ...data,
      id: editPlayList?.id,
      coverId: playListCoverId !== -1 ? playListCoverId : undefined,
    });
    message.destroy();
    setState(state => ({
      ...state,
      playListLoading: false,
      pageIndex: 1,
      hasMore: true,
      playlists: [],
      isEditPlayListModalVisible: false,
    }));
    loadPlayListData(1);
    if (flag) {
      message.success('修改成功，审核马上就好');
    } else message.error('修改失败');
  };

  const onPlayListDelete = async (id: number) => {
    message.loading('删除中，请稍候');
    setState(state => ({
      ...state,
      playListLoading: true,
    }));
    const flag = await api.deletePlayList({
      id,
    });
    setState(state => ({
      ...state,
      playListPopVisible: false,
      playListLoading: false,
      playlists: [],
    }));
    message.destroy();
    if (flag) {
      setState(state => ({
        ...state,
        pageIndex: 1,
        hasMore: true,
        playlists: [],
      }));
      loadPlayListData(1);
      message.success('删除成功');
    } else message.error('删除失败');
  };

  return (
    <div className='personal-center'>
      <main className='main'>
        <div className='personal-center-container'>
          <If
            flag={useInfoLoading}
            element1={<Loading />}
            element2={
              <div className='personal-info'>
                <div className='personal-info-avatar'>
                  <Avatar
                    imgSrc={userInfo?.avatar}
                    size={5}
                    editIcon={_userInfo?.id === parseInt(_id) ? true : false}
                    onClick={() => _userInfo?.id === parseInt(_id) && onChange('message')}
                  />
                </div>
                <p className='personal-name'>{userInfo?.nickName}</p>
              </div>
            }
          />
          <Tabs
            defaultActiveKey='message'
            onChange={onChange}
            tabPosition={tabPosition}
            className='personal-tabs'
            activeKey={tabKey}
          >
            {_userInfo?.id === id ? (
              <TabPane tab='信息' key='message'>
                <If
                  flag={tabKey === TabKey.MESSAGE}
                  element1={
                    <>
                      <Divider plain orientation='left'>
                        头像
                      </Divider>
                      <div className='upload-avatar'>
                        <Divider plain orientation='left'>
                          预览
                        </Divider>
                        <Image
                          width={216}
                          src={_userInfo?.avatar ?? DefaultImg}
                          preview={_userInfo?.avatar !== null}
                        />
                        <Divider plain orientation='left'>
                          上传
                        </Divider>
                        <ImgCrop modalOk='确定' modalCancel='取消'>
                          <Upload
                            action={BASE_URL + '/api/file/uploadAvatar'}
                            listType='picture'
                            maxCount={1}
                            style={{ width: '2rem' }}
                            headers={{
                              token: localStorage.getItem(TOKEN) ?? '',
                            }}
                            showUploadList={{ showPreviewIcon: false }}
                            onPreview={() => false}
                            onChange={({ file }) => {
                              if (file && file.status === 'error')
                                message.error(file.response?.message);
                              else if (file.response?.code === 1 && file.status !== 'removed') {
                                message.success('上传成功');
                              }
                            }}
                            name='avatar'
                          >
                            <Button icon={<UploadOutlined />}>上传/更改头像</Button>
                          </Upload>
                        </ImgCrop>
                      </div>
                      <Divider plain orientation='left'>
                        修改密码
                      </Divider>
                      <Form
                        name='basic'
                        wrapperCol={{ lg: 12, xs: 24 }}
                        autoComplete='off'
                        className='password-form'
                        onFinish={onFinish}
                      >
                        <Form.Item name='oldpassword' rules={passwordRule}>
                          <Input placeholder='原密码' />
                        </Form.Item>
                        <Form.Item name='newpassword' rules={passwordRule}>
                          <Input placeholder='新密码，请自己牢记哦' />
                        </Form.Item>
                        <Form.Item wrapperCol={{ span: 12 }}>
                          <Button type='primary' htmlType='submit' loading={changePasswordLoading}>
                            修改密码
                          </Button>
                        </Form.Item>
                      </Form>
                      <Divider plain orientation='left'>
                        登出
                      </Divider>
                      <div className='msg-logout'>
                        <Popconfirm
                          title='确定退出本账号吗？'
                          onConfirm={() => logOut()}
                          okText='确定'
                          cancelText='取消'
                        >
                          <Button type='primary' danger>
                            退出账号
                          </Button>
                        </Popconfirm>
                      </div>
                    </>
                  }
                />
              </TabPane>
            ) : null}
            <TabPane tab='动态' key='dynamic'>
              <If
                flag={tabKey === TabKey.DYNAMIC}
                element1={
                  <InfiniteScroll
                    dataLength={dynamics.length}
                    next={loadDynamicsData}
                    hasMore={hasMore}
                    loader={
                      <div style={{ padding: '0 1rem' }}>
                        <Skeleton avatar active />
                      </div>
                    }
                    endMessage={
                      <If flag={_userInfo?.id === id || dynamics.length === 0}
                          element2={<Empty text='暂无更多...' />} />
                    }
                  >
                    <For data={dynamics}>
                      {(dynamic: IDynamic) => (
                        <DynamicCard
                          onComment={onComment}
                          onClickSong={addPlayList}
                          onDelete={onDynamicDelete}
                          deleteLoading={dynamicLoading}
                          {...dynamic}
                          key={dynamic.id}
                        />
                      )}
                    </For>
                  </InfiniteScroll>
                }
              />
            </TabPane>
            <TabPane tab='歌单' key='playlist'>
              <If
                flag={tabKey === TabKey.PLAYLIST}
                element1={
                  <>
                    <If
                      flag={_userInfo?.id === id}
                      element1={
                        <>
                          <div
                            className='playlist-add'
                            onClick={() =>
                              setState(state => ({
                                ...state,
                                isCreatePlayListModalVisible: true,
                              }))
                            }
                          >
                            <PlusOutlined />
                            <span>添加歌单</span>
                          </div>
                          <Divider plain orientation='left'>
                            我的歌单
                          </Divider>
                          <Modal
                            title='创建歌单'
                            visible={isCreatePlayListModalVisible}
                            onCancel={() =>
                              setState(state => ({
                                ...state,
                                isCreatePlayListModalVisible: false,
                              }))
                            }
                            footer={null}
                            destroyOnClose
                          >
                            <Form name='basic' onFinish={createPlaylist} autoComplete='off'>
                              <Form.Item name='name' rules={playListNameRule}>
                                <Input placeholder='歌单名称' />
                              </Form.Item>
                              <Form.Item wrapperCol={{ span: 24 }}>
                                <Button type='primary' htmlType='submit' loading={playListLoading}>
                                  创建
                                </Button>
                              </Form.Item>
                            </Form>
                          </Modal>
                        </>
                      }
                    />
                    <InfiniteScroll
                      dataLength={playlists.length}
                      next={loadPlayListData}
                      hasMore={hasMore}
                      loader={<Skeleton active />}
                      endMessage={
                        <If flag={_userInfo?.id === id || playlists.length === 0}
                            element2={<Empty text='暂无更多...' />} />
                      }
                    >
                      <For data={playlists}>
                        {(playList: IPlayListSimple) => (
                          <div className='col-container' key={playList.id}>
                            <MusicCard
                              src={playList.cover ?? DefaultImg}
                              row
                              height={12}
                              playBtn={false}
                              onClick={() => {
                                push('/client/playlist/' + playList.id);
                              }}
                              imgWidth={12}
                            >
                              <div className='playlist-card-bottom'>
                                <div className='playlist-card-info'>
                                  <span
                                    className='playlist-name'
                                    onClick={() => {
                                      push('/client/playlist/' + playList.id);
                                    }}
                                  >
                                    {playList.name}
                                  </span>
                                  <If
                                    flag={_userInfo?.id === id}
                                    element1={
                                      <>
                                        <div className='playlist-actions'>
                                          <Popconfirm
                                            title='确定要删除吗？'
                                            onConfirm={() => onPlayListDelete(playList.id)}
                                            okText='确认'
                                            cancelText='取消'
                                            okButtonProps={{ loading: playListLoading }}
                                            visible={playList.playListPopVisible}
                                            onCancel={() =>
                                              setState(state => ({
                                                ...state,
                                                playlists: state.playlists.map(item => ({
                                                  ...item,
                                                  playListPopVisible: false,
                                                })),
                                              }))
                                            }
                                          >
                                            <a
                                              className='playlist-edit'
                                              onClick={() =>
                                                setState(state => ({
                                                  ...state,
                                                  playlists: state.playlists.map(item => ({
                                                    ...item,
                                                    playListPopVisible:
                                                      item.id === playList.id ? true : false,
                                                  })),
                                                }))
                                              }
                                            >
                                              删除
                                            </a>
                                          </Popconfirm>
                                          <a
                                            className='playlist-edit'
                                            onClick={() => {
                                              setState(state => ({
                                                ...state,
                                                editPlayList: playList,
                                                playlists: state.playlists.map(item => ({
                                                  ...item,
                                                  isEditPlayListModalVisible:
                                                    item.id === playList.id ? true : false,
                                                })),
                                              }));
                                            }}
                                          >
                                            编辑
                                          </a>
                                        </div>
                                        <Modal
                                          title='修改歌单信息'
                                          visible={playList.isEditPlayListModalVisible}
                                          onCancel={() =>
                                            setState(state => ({
                                              ...state,
                                              editPlayList: {},
                                              playListCoverId: -1,
                                              playlists: state.playlists.map(item => ({
                                                ...item,
                                                isEditPlayListModalVisible: false,
                                              })),
                                            }))
                                          }
                                          footer={null}
                                          destroyOnClose
                                        >
                                          <Form
                                            name='basic'
                                            onFinish={updatePlayList}
                                            autoComplete='off'
                                          >
                                            <Form.Item
                                              name='name'
                                              rules={playListNameRule}
                                              label='歌单名称'
                                            >
                                              <Input
                                                placeholder='请填写歌单名称'
                                                defaultValue={editPlayList.name}
                                              />
                                            </Form.Item>
                                            <Form.Item
                                              name='describe'
                                              rules={playListDescribeRule}
                                              label='简介'
                                            >
                                              <Input.TextArea
                                                placeholder='请填写简介'
                                                rows={3}
                                                defaultValue={editPlayList?.describe}
                                              />
                                            </Form.Item>
                                            <div className='form-upload-cover'>
                                              <span className='form-upload-cover-label'>
                                                封面：
                                              </span>
                                              <div className='upload-img'>
                                                <Image
                                                  width={200}
                                                  src={editPlayList?.cover ?? DefaultImg}
                                                  preview={editPlayList?.cover !== null}
                                                />
                                              </div>
                                              <ImgCrop modalOk='确定' modalCancel='取消'>
                                                <Upload
                                                  action={BASE_URL + '/api/file/uploadImage'}
                                                  listType='picture'
                                                  maxCount={1}
                                                  style={{ width: '2rem' }}
                                                  headers={{
                                                    token: localStorage.getItem(TOKEN) ?? '',
                                                  }}
                                                  onChange={({ file }) => {
                                                    if (file && file.status === 'error')
                                                      message.error(file.response?.message);
                                                    else if (
                                                      file.response?.code === 1 &&
                                                      file.status !== 'removed'
                                                    ) {
                                                      setState(state => ({
                                                        ...state,
                                                        playListCoverId: file.response.data.id,
                                                      }));
                                                      message.success('上传成功');
                                                    }
                                                  }}
                                                  name='img'
                                                >
                                                  <Button icon={<UploadOutlined />}>
                                                    上传/更改封面
                                                  </Button>
                                                </Upload>
                                              </ImgCrop>
                                            </div>
                                            <Form.Item
                                              wrapperCol={{ span: 24 }}
                                              style={{ marginBottom: 0 }}
                                            >
                                              <Button
                                                type='primary'
                                                htmlType='submit'
                                                loading={playListLoading}
                                              >
                                                保存
                                              </Button>
                                            </Form.Item>
                                          </Form>
                                        </Modal>
                                      </>
                                    }
                                  />
                                </div>
                                <div className='playlist-tag-container'>
                                  <For data={playList.styles} emptyEl={false}>
                                    {(style: IStyle) => (
                                      <Tag key={style.id} className='playlist-tag'>
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
                  </>
                }
              />
            </TabPane>
            {userInfo?.role?.id === 2 ? (
              <TabPane tab='专辑' key='album'>
                <If flag={tabKey === TabKey.ALBUM} element1={
                  <InfiniteScroll
                    dataLength={albums.length}
                    next={loadAlbumsData}
                    hasMore={hasMore}
                    loader={<Skeleton active />}
                    endMessage={
                      <If flag={_userInfo?.id === id || albums.length === 0}
                          element2={<Empty text='暂无更多...' />} />
                    }
                  >
                    <For data={albums}>
                      {(album: ISearchAlbum) => (
                        <div className='col-container' key={album.id}>
                          <MusicCard
                            src={album.cover ?? DefaultImg}
                            row
                            height={12}
                            playBtn={false}
                            onClick={() => {
                              push('/client/album/' + album.id);
                            }}
                            imgWidth={12}
                          >
                            <div
                              className='playlist-card-bottom'
                              onClick={() => {
                                push('/client/album/' + album.id);
                              }}
                              style={{ cursor: 'pointer' }}
                            >
                              <div className='playlist-card-info'>
                                  <span className='playlist-name'>
                                    {album.name}
                                  </span>
                              </div>
                              <div className='playlist-tag-container'>
                                <For data={album.styles} emptyEl={false}>
                                  {(style: IStyle) => (
                                    <Tag key={style.id} className='playlist-tag'>
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
                  </InfiniteScroll>} />
              </TabPane>
            ) : null}
            {_userInfo?.id === id ? (
              <TabPane tab='制作人' key='artist' />
            ) : null}
          </Tabs>
        </div>
      </main>
    </div>
  );
};
export default PersonalCenter;
