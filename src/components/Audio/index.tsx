import { IDispatch, ISongSimple, IStoreState } from '@/common/typings';
import { useDidUpdateEffect, usePlayList } from '@/hooks';
import { clearPlaySong, deletePlaySong } from '@/store/actions';
import { CaretRightOutlined, LeftOutlined, PauseOutlined, RightOutlined } from '@ant-design/icons';
import { Button, Drawer, message, Popconfirm } from 'antd';
import { isEmpty } from 'lodash';
import React, { FC, MouseEvent, ReactElement, useEffect, useRef, useState } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { For, If, MusicCard } from '..';
import './index.less';
import { IState } from './interface';
import DefaultImg from '@/assets/emptyImg.webp';

const LeftOrRightStyle = {
  fontSize: '1.6rem',
  cursor: 'pointer',
  margin: '0 .2rem',
  color: 'var(--link-color)',
};
const PlayStyle = {
  fontSize: '3.2rem',
  cursor: 'pointer',
  margin: '0 .2rem',
  color: 'var(--main-color)',
};
const _Audio: FC = (): ReactElement => {
  const dispatch = useDispatch<IDispatch<number | void>>();
  const songs = useSelector((state: IStoreState) => state.AudioReducer, shallowEqual);
  const [{ playingSong, state, progressWidth, visible, index }, setState] = useState<IState>({
    playingSong: songs[0] ?? null,
    state: 'paused',
    progressWidth: 0,
    visible: false,
    index: 0,
  });
  const audio = useRef<HTMLAudioElement>(new Audio(playingSong?.file));
  const audioBar = useRef<HTMLDivElement>(null);
  const timer = useRef<number>(-1);
  const { delPlayList } = usePlayList();

  useEffect(() => {
    audio.current.loop = false;
    const onError = function () {
      if (songs.length === 0) return;
      pause();
      delPlayList(playingSong?.id);
      setState(state => ({
        ...state,
        playingSong: undefined,
        index: 0,
      }));
      message.destroy();
      message.error('链接失效了，抱歉');
    };
    audio.current.addEventListener('error', onError);
    const songEnd = () => {
      nextSong();
    };
    audio.current.addEventListener('ended', songEnd);
    return () => {
      clearInterval(timer.current);
      audio.current.removeEventListener('ended', songEnd);
      audio.current.removeEventListener('error', onError);
    };
  }, [playingSong]);

  const clearPlaySongs = () => {
    dispatch(clearPlaySong());
    pause();
    setState(state => ({
      ...state,
      progressWidth: 0,
      visible: false,
      playingSong: undefined,
      index: 0,
    }));
    message.destroy();
  };

  const onOpen = () => {
    setState(state => ({
      ...state,
      visible: true,
    }));
  };

  const onClose = () => {
    setState(state => ({
      ...state,
      visible: false,
    }));
  };

  const changeSong = (song: ISongSimple, i: number) => {
    audio.current.src = song.file;
    setState(state => ({
      ...state,
      progressWidth: 0,
      state: 'playing',
      playingSong: song,
      visible: false,
      index: i,
    }));
    play();
  };

  const deletePlaysongById = (id: number) => {
    dispatch(deletePlaySong(id));
    if (playingSong!.id === id) {
      setState(state => ({
        ...state,
        index: 0,
      }));
    }
  };

  const addprogressWidth = () => {
    const width =
      (audio.current.currentTime / audio.current.duration) * audioBar.current!.offsetWidth;
    if (isNaN(width)) return;
    setState(state => ({
      ...state,
      progressWidth: width,
    }));
  };

  const pause = () => {
    setState(state => ({
      ...state,
      state: 'paused',
    }));
  };

  const play = () => {
    setState(state => ({
      ...state,
      state: 'playing',
    }));
  };

  useDidUpdateEffect(() => {
    (async () => {
      clearInterval(timer.current);
      if (state === 'paused') {
        audio.current.pause();
      } else {
        try {
          await audio.current.play();
        } catch (e) {
          // pause();
        }
        timer.current = setInterval(addprogressWidth, 500) as unknown as number;
      }
    })();
  }, [state]);

  useDidUpdateEffect(() => {
    if (isEmpty(songs)) {
      audio.current.src = '';
      pause();
      setState(state => ({
        ...state,
        progressWidth: 0,
      }));
    }
    play();
    setState(state => ({
      ...state,
      playingSong: songs[0],
    }));
  }, [songs]);

  const preSong = () => {
    if (!songs) return;
    if (index > 0) {
      setState(state => ({
        ...state,
        index: state.index - 1,
      }));
    } else {
      setState(state => ({
        ...state,
        index: songs.length - 1,
      }));
    }
  };

  const nextSong = () => {
    if (!songs) return;
    setState(state => ({
      ...state,
      index: state.index + 1,
    }));
  };

  useDidUpdateEffect(() => {
    if (!songs) return;
    if (songs.length <= index) {
      setState(state => ({
        ...state,
        index: 0,
      }));
    }
    setState(state => ({
      ...state,
      progressWidth: 0,
      playingSong: songs[index],
      state: 'playing',
    }));
  }, [index]);

  useDidUpdateEffect(() => {
    (async () => {
      setState(state => ({
        ...state,
        progressWidth: 0,
      }));
      if (!playingSong) return;
      audio.current.src = playingSong?.file;
      try {
        await audio.current.play();
      } catch (e) {
        // pause();
      }
    })();
  }, [playingSong]);

  const onClickPlayIcon = () => {
    if (!playingSong) return;
    audio.current.paused ? play() : pause();
  };

  const onClickAudioBar = (event: MouseEvent<HTMLDivElement>) => {
    if (!audio.current.src) return;
    const target = event.target as HTMLDivElement;
    const percent = (event.clientX - target.offsetLeft) / audioBar.current!.clientWidth;
    setState(state => ({ ...state, progressWidth: percent * audioBar.current!.clientWidth }));
    audio.current.currentTime = percent * audio.current.duration;
  };

  return (
    <div className="audio">
      <MusicCard
        height={6}
        imgWidth={6}
        row
        src={playingSong?.cover ?? DefaultImg}
        style={{ cursor: 'pointer', width: '30%' }}
        fileSrc={playingSong?.file}
        onClick={onOpen}
        playBtn={false}
      >
        <div className="card-child">
          <If
            flag={isEmpty(playingSong)}
            element1={<p>暂无歌曲</p>}
            element2={
              <p>
                {playingSong?.name}
                <span>{playingSong?.artists?.map(artist => artist.nickName).join(',')}</span>
              </p>
            }
          />
        </div>
      </MusicCard>
      <div className="audio-player-container">
        <div className="audio-player-buttons">
          <LeftOutlined style={LeftOrRightStyle} onClick={preSong} />
          <If
            flag={state === 'paused' || isEmpty(songs)}
            element1={<CaretRightOutlined style={PlayStyle} onClick={onClickPlayIcon} />}
            element2={<PauseOutlined style={PlayStyle} onClick={onClickPlayIcon} />}
          />
          <RightOutlined style={LeftOrRightStyle} onClick={nextSong} />
        </div>
        <div className="audio-player">
          <div className="audio-bar" ref={audioBar} onClick={onClickAudioBar}>
            <div className="audio-progress transition-2" style={{ width: progressWidth }}></div>
          </div>
        </div>
      </div>
      <Drawer
        title="播放列表"
        placement="bottom"
        closable={false}
        onClose={onClose}
        visible={visible && songs.length > 0}
      >
        <Popconfirm title="确定要清除吗" onConfirm={clearPlaySongs} okText="确定" cancelText="取消">
          <Button type="primary" style={{ width: '100%' }}>
            清除所有
          </Button>
        </Popconfirm>
        <For data={songs}>
          {(song: ISongSimple, index: number) => (
            <MusicCard
              height={5}
              imgWidth={5}
              row
              src={song?.cover}
              style={{ cursor: 'pointer' }}
              fileSrc={song?.file}
              onClick={() => changeSong(song, index)}
              lazyLoad={false}
              key={song?.id}
            >
              <div className="drawer-card-child">
                <p>
                  {song?.name}
                  <span>{song?.artists?.map(artist => artist.nickName).join(',')}</span>
                  <span onClick={() => deletePlaysongById(song.id)}>移除</span>
                </p>
              </div>
            </MusicCard>
          )}
        </For>
      </Drawer>
    </div>
  );
};
export default _Audio;
