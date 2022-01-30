import { IDispatch, IStoreState, IUserInfo } from '@/common/typings';
import {
  saveUserInfo as _saveUserInfo,
  saveAdminInfo as _saveAdminInfo,
  clearUserInfo as _clearUserInfo,
} from '@/store/actions';
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
    isLogin: !isEmpty(userInfo),
    isAdmin: isEmpty(userInfo) ? false : userInfo?.role.isAdmin,
    saveUserInfo,
    saveAdminInfo,
    clearUserInfo,
  };
}

export { useUserInfo };
