import { IDispatch, IDynamicSong } from '@/common/typings';
import { addPlaySong, deletePlaySong } from '@/store/actions';
import { message } from 'antd';
import { useDispatch } from 'react-redux';
import { useUserInfo } from '.';

function usePlayList() {
  const dispatch = useDispatch<IDispatch<IDynamicSong | number>>();
  const { isLogin } = useUserInfo();
  const addPlayList = (song: IDynamicSong) => {
    if (!isLogin) {
      message.info('请登录后再执行此操作');
      return;
    }
    dispatch(addPlaySong(song));
  };
  const delPlayList = (id: number | undefined) => {
    if (!id) return;
    if (!isLogin) {
      message.info('请登录后再执行此操作');
      return;
    }
    dispatch(deletePlaySong(id));
  };
  return {
    addPlayList,
    delPlayList,
  };
}
export { usePlayList };
