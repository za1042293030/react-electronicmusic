import { Action } from 'redux';
import { Dispatch } from 'react';
import { IDynamicSong, IUserInfo } from '.';

interface IAction<T = any> extends Action<string> {
  payload?: T;
}

type IActionFunc<T = any> = (dispatch: IDispatchSync<T>) => void | Promise<void>;

type IDispatchSync<T = any> = Dispatch<IAction<T>>;

type IDispatchAsync<T = any> = Dispatch<IActionFunc<T>>;

type IDispatch<T = any> = IDispatchSync<T> & IDispatchAsync<T>;

type IStoreState = {
  LoginReducer: IUserInfo;
  AudioReducer: IDynamicSong[];
};

export type { IAction, IDispatch, IActionFunc, IStoreState, IDispatchAsync };
