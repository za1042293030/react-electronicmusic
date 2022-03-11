import { BaseResponse, IDynamicSong, IFile, ISongSimple } from '@/common/typings';
import { Empty, For, If, MusicCard, SearchInput } from '@/components';
import { Button, Upload, Image, Modal, message, Checkbox, Skeleton, Tooltip } from 'antd';
import { UploadFile } from 'antd/lib/upload/interface';
import React, { FC, ReactElement, useCallback, useMemo, useRef, useState } from 'react';
import DefaultSongImg from '@/assets/emptyImg.jpg';
import './index.less';
import { PlusOutlined } from '@ant-design/icons';
import { BASE_URL, TOKEN } from '@/common/constants';
import { isEmpty } from 'lodash';
import api from '@/services';
import { dynamicContentValid, searchInputValid } from '@/utils';
import { IProps } from './props';

interface IState {
  fileList: UploadFile<BaseResponse<IFile>>[];
  imagePreviewVisible: boolean;
  modalVisible: boolean;
  song: IDynamicSong | undefined;
  songs: IDynamicSong[] | undefined | null;
  loading: boolean;
  submitLoading: boolean;
}

const DynamicForm: FC<IProps> = ({ onClick }): ReactElement => {
  const [state, setState] = useState<IState>({
    fileList: [],
    imagePreviewVisible: false,
    modalVisible: false,
    song: undefined,
    songs: [],
    loading: true,
    submitLoading: false,
  });
  const isPrivate = useRef(false);

  const onCencel = useCallback(() => {
    setState(state => ({ ...state, modalVisible: false }));
  }, []);
  const selectSong = useCallback((song: ISongSimple) => {
    if (song) setState(state => ({ ...state, song, modalVisible: false }));
  }, []);

  const selectSongsChildren = useCallback(
    (song: ISongSimple) => (
      <li key={song?.id} className='search-songs-list-item'>
        <MusicCard
          height={5}
          row
          src={song?.cover}
          style={{ cursor: 'pointer' }}
          fileSrc={song?.file}
          onClick={() => onClick && onClick(song)}
        >
          <div className='card-child' onClick={() => selectSong(song)}>
            <Tooltip
              placement="right"
              title={'曲名：'+song?.name + ' 制作人：' + song.artists?.map(artist => artist.nickName).join(',')}>
              <p>
                {song?.name} <span>{song?.artists?.map(artist => artist.nickName).join(',')}</span>
              </p>
            </Tooltip>
          </div>
        </MusicCard>
      </li>
    ),
    [],
  );
  const imagePreview = useMemo(
    () => (
      <div style={{ display: 'none' }}>
        <Image.PreviewGroup
          preview={{
            visible: state.imagePreviewVisible,
            onVisibleChange: (vis: boolean) =>
              setState(state => ({ ...state, imagePreviewVisible: vis })),
          }}
        >
          <For data={state.fileList}>
            {(file: UploadFile<BaseResponse>) => (
              <Image src={file.response?.data?.src} key={file.uid} />
            )}
          </For>
        </Image.PreviewGroup>
      </div>
    ),
    [state.fileList, state.imagePreviewVisible],
  );
  const clearSong = () => {
    setState(state => ({ ...state, song: undefined }));
  };
  const musicCardChild = useMemo(
    () => (
      <div
        className='card-child'
        onClick={async () => {
          if (isEmpty(state.songs)) {
            const songs = await api.getRecommendSongs(5);
            setState(state => ({ ...state, songs, loading: false }));
          }
        }}
      >
        <If
          flag={isEmpty(state.song)}
          element1={
            <p
              onClick={() => {
                setState(state => ({ ...state, modalVisible: true }));
              }}
            >
              选择音乐，代表心情
            </p>
          }
          element2={
            <div className='card-child'>
              <p
                onClick={() => {
                  setState(state => ({ ...state, modalVisible: true }));
                }}
              >
                {state.song?.name}
                <span>{state.song?.artists?.map(artist => artist.nickName).join(',')}</span>
              </p>
              <If flag={!isEmpty(state.song)} element1={<span onClick={clearSong}>移除</span>} />
            </div>
          }
        />
      </div>
    ),
    [state.song, state.songs],
  );

  //发布动态
  const contentRef = useRef<HTMLTextAreaElement>(null);
  const onSearch = useCallback(async (value: string) => {
    if (!searchInputValid(value)) return;
    let songs: ISongSimple[] | ISongSimple[] | undefined | null;
    setState(state => ({ ...state, loading: true }));
    if (value.trim().length === 0) {
      songs = await api.getRecommendSongs(5);
    } else {
      songs = await api.getSongsByNameOrProducer(value);
    }
    setState(state => ({ ...state, songs: isEmpty(songs) ? [] : songs, loading: false }));
  }, []);

  const onChange = () => {
    isPrivate.current = !isPrivate.current;
  };

  const sendDynamic = useCallback(async () => {
    const content = contentRef.current?.value;
    if (!dynamicContentValid(content)) return;
    setState(state => ({ ...state, submitLoading: true }));
    message.loading('发布中，请稍候');
    const flag = await api.sendDynamic({
      content: content!,
      songId: isEmpty(state.song) ? undefined : state.song!.id,
      pictureIds: !isEmpty(state.fileList)
        ? (state.fileList
          .map(file => {
            if (file.status === 'success' || file.status === 'done')
              return file.response?.data.id;
          })
          .filter(id => id !== undefined) as number[])
        : undefined,
      isPrivate: isPrivate.current,
    });
    message.destroy();
    setState(state => ({ ...state, submitLoading: false }));
    if (flag) {
      if (isPrivate.current) message.success('发送成功');
      else message.success('发布成功，审核马上就好');
      contentRef.current!.value = '';
      setState(state => ({ ...state, fileList: [], songId: undefined, song: undefined }));
    } else {
      message.error('发布失败');
    }
  }, [state.fileList, state.song, contentRef]);

  return (
    <div className='dynamic-form'>
      <form>
        <textarea
          className='textarea transition-2'
          placeholder='说你想说的'
          rows={5}
          ref={contentRef}
        ></textarea>
        <div className='song'>
          <MusicCard
            row
            src={state.song?.cover ?? DefaultSongImg}
            height={5}
            onClick={() => state.song && onClick && onClick(state.song)}
            fileSrc={state.song?.file}
            playBtn={state.song ? true : false}
          >
            {musicCardChild}
          </MusicCard>
        </div>
        <div className='form-bottom'>
          <div className='img-upload'>
            <Upload
              action={BASE_URL + '/api/file/uploadImage'}
              listType='picture-card'
              fileList={state.fileList}
              onChange={({ file, fileList }) => {
                if (file && file.status === 'error') message.error(file.response?.message);
                setState(state => ({ ...state, fileList }));
              }}
              onPreview={() => setState(state => ({ ...state, imagePreviewVisible: true }))}
              headers={{
                token: localStorage.getItem(TOKEN) ?? '',
              }}
              name='img'
            >
              {state.fileList.length < 9 && <PlusOutlined style={{ fontSize: '2rem' }} />}
            </Upload>
          </div>
          <div className='send'>
            <Checkbox className='public-checkbox' onChange={onChange}>
              私密
            </Checkbox>
            <Button type='primary' onClick={sendDynamic} loading={state.submitLoading}>
              发布
            </Button>
          </div>
        </div>
      </form>
      <If flag={!isEmpty(state.fileList)} element1={imagePreview} />
      <Modal title='选择音乐' visible={state.modalVisible} onCancel={onCencel} footer={null}>
        <SearchInput placeholder='搜索音乐或制作人' onSearch={onSearch} />
        <If
          flag={!state.loading && !isEmpty(state.songs)}
          element1={
            <For data={state.songs!} tag='ul' className='search-songs-list'>
              {selectSongsChildren}
            </For>
          }
          element2={<If flag={!state.loading} element1={<Empty />}
                        element2={<Skeleton active />} />}
        />
      </Modal>
    </div>
  );
};
export default DynamicForm;
