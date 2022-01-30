import { AudioAction } from '@/common/enums';
import { IAction, IDynamicSong } from '@/common/typings';

const savePlaySongs = (songs: IDynamicSong[]): IAction<IDynamicSong[]> => ({
  type: AudioAction.SAVE_PLAY_SONGS,
  payload: songs,
});

const addPlaySong = (song: IDynamicSong): IAction<IDynamicSong> => ({
  type: AudioAction.ADD_PLAY_SONG,
  payload: song,
});

const deletePlaySong = (id: number): IAction<number> => ({
  type: AudioAction.DELETE_PLAY_SONG,
  payload: id,
});

const clearPlaySong = (): IAction<void> => ({
  type: AudioAction.CLEAR_PLAY_SONG,
});

export { savePlaySongs, addPlaySong, deletePlaySong, clearPlaySong };
