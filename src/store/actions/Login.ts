import { UserAction } from '@/common/enums';
import { IUserInfo, IActionFunc, IAction } from '@/common/typings';
import api from '@/services';

const saveUserInfo =
  (id: number): IActionFunc<IUserInfo> =>
  async dispatch => {
    const userInfo = await api.getUserInfo(id);
    if (!userInfo) return;
    dispatch({
      type: UserAction.SAVE_USER_INFO,
      payload: userInfo,
    });
  };

const saveAdminInfo = (id: number): IActionFunc<IUserInfo> => {
  return async dispatch => {
    const userInfo = await api.getAdminInfo(id);
    if (!userInfo) return;
    dispatch({
      type: UserAction.SAVE_USER_INFO,
      payload: userInfo,
    });
  };
};

const clearUserInfo = (): IAction => ({
  type: UserAction.CLEAR_USER_INFO,
});

export { saveUserInfo, saveAdminInfo, clearUserInfo };
