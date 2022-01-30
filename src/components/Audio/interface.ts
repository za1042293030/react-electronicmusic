import { IDynamicSong } from '@/common/typings';

interface IState {
  playingSong: IDynamicSong | undefined;
  state: 'playing' | 'paused';
  progressWidth: number;
  visible: boolean;
  index: number;
}
export type { IState };
