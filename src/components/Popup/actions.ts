import { IAction } from '@/common/typings';
import { ActionType } from './enum';

const setWidth = (width: number): IAction<number> => ({
  type: ActionType.SETWIDTH,
  payload: width,
});

const setHeight = (height: number): IAction<number> => ({
  type: ActionType.SETHEIGHT,
  payload: height,
});

const setLeftOffset = (leftOffset: number): IAction<number> => ({
  type: ActionType.SETLEFFOFFSET,
  payload: leftOffset,
});

const setState = (state: boolean): IAction<boolean> => ({
  type: ActionType.SETSTATE,
  payload: state,
});

export { setWidth, setHeight, setLeftOffset, setState };
