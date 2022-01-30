import { IAction, IUserInfo } from '@/common/typings';
import { UserAction } from '@/common/enums';
import { TOKEN } from '@/common/constants';

const initState =
  localStorage.getItem(TOKEN) && JSON.parse(localStorage.getItem('userInfo') || '{}');
export function LoginReducer(
  state: IUserInfo | Record<string, any> = initState,
  action: IAction<IUserInfo>
): IUserInfo | Record<string, any> {
  const { type, payload } = action;
  switch (type) {
    case UserAction.SAVE_USER_INFO:
      return payload!;
    case UserAction.CLEAR_USER_INFO:
      localStorage.removeItem('userInfo');
      return {};
    default:
      return state;
  }
}
