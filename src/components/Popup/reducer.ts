import { IAction } from '@/common/typings';
import { ActionType } from './enum';
import { IState } from './typings';

function reducer(state: IState, action: IAction<number | boolean>): IState {
  const { type, payload } = action;
  switch (type) {
    case ActionType.SETHEIGHT:
      return { ...state, _height: payload as number };
    case ActionType.SETWIDTH:
      return { ...state, _width: payload as number };
    case ActionType.SETLEFFOFFSET:
      return { ...state, leftOffset: payload as number };
    case ActionType.SETSTATE:
      return { ...state, state: payload as boolean };
    default:
      return state;
  }
}
export { reducer };
