import { IAction, IDynamicSong } from '@/common/typings';
import { AudioAction } from '@/common/enums';
import { isEmpty } from 'lodash';
import { message } from 'antd';

const maxSongs = 30;
const initState: IDynamicSong[] = (
  JSON.parse(localStorage.getItem('playSongs') || '[]') as IDynamicSong[]
).slice(0, maxSongs);
export function AudioReducer(
  state: IDynamicSong[] = initState,
  action: IAction<IDynamicSong | IDynamicSong[] | number>
): IDynamicSong[] {
  const { type, payload } = action;
  switch (type) {
    case AudioAction.SAVE_PLAY_SONGS: {
      if (state.length >= maxSongs) {
        message.destroy();
        message.info(`播放列表最多存在${maxSongs}首歌`);
        return state;
      }
      localStorage.setItem('playSongs', JSON.stringify(payload));
      return payload! as IDynamicSong[];
    }
    case AudioAction.ADD_PLAY_SONG: {
      if (!isEmpty(state.filter(state => state.id === (payload as IDynamicSong).id))) {
        message.destroy();
        message.info('这首歌已经在播放列表了');
        return state;
      }
      if (state.length >= maxSongs) {
        message.destroy();
        message.info(`播放列表最多存在${maxSongs}首歌`);
        return state;
      }
      const newState = [payload as IDynamicSong, ...state];
      localStorage.setItem('playSongs', JSON.stringify(newState));
      return newState;
    }
    case AudioAction.DELETE_PLAY_SONG: {
      const newState = state.filter(state => state.id !== payload);
      localStorage.setItem('playSongs', JSON.stringify(newState));
      return newState;
    }
    case AudioAction.CLEAR_PLAY_SONG:
      localStorage.setItem('playSongs', JSON.stringify([]));
      return [];
    default:
      return state;
  }
}
