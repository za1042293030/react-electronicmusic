import { TOKEN } from '@/common/constants';
import { IDispatch, IJwtPayload, IStoreState, IUserInfo } from '@/common/typings';
import {
  saveUserInfo as _saveUserInfo,
  saveAdminInfo as _saveAdminInfo,
  clearUserInfo as _clearUserInfo,
} from '@/store/actions';
import { decode } from 'jsonwebtoken';
import { isEmpty } from 'lodash';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';

function useUserInfo() {
  const userInfo = useSelector((state: IStoreState) => state.LoginReducer, shallowEqual);
  const dispatch = useDispatch<IDispatch<IUserInfo>>();

  const saveUserInfo = (id: number) => {
    dispatch(_saveUserInfo(id));
  };
  const saveAdminInfo = (id: number) => {
    dispatch(_saveAdminInfo(id));
  };
  const clearUserInfo = () => {
    dispatch(_clearUserInfo());
  };
  return {
    userInfo,
    isLogin: localStorage.getItem(TOKEN) ? true : false,
    isAdmin: !localStorage.getItem(TOKEN) ? false : (decode(localStorage.getItem(TOKEN) as string) as IJwtPayload)?.isAdmin,
    saveUserInfo,
    saveAdminInfo,
    clearUserInfo,
    id: (decode(localStorage.getItem(TOKEN) as string) as IJwtPayload)?.id,
  };
}

export { useUserInfo };
