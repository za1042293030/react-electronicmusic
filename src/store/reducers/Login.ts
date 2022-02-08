import { IAction, IUserInfo } from '@/common/typings';
import { UserAction } from '@/common/enums';
import { TOKEN } from '@/common/constants';

const initState = {};
export function LoginReducer(
  state: IUserInfo | {} = initState,
  action: IAction<IUserInfo>
): IUserInfo | {} {
  const { type, payload } = action;
  switch (type) {
    case UserAction.SAVE_USER_INFO:
      return payload!;
    case UserAction.CLEAR_USER_INFO:
      localStorage.removeItem(TOKEN);
      return {};
    default:
      return state;
  }
}
