import React, {
  forwardRef,
  memo,
  ReactElement,
  Reducer,
  useEffect,
  useImperativeHandle,
  useMemo,
  useReducer,
  useRef,
} from 'react';
import { IProps, IState } from './typings';
import './index.less';
import { IPopupRef } from './ref';
import { useDidUpdateEffect, useToggleClass } from '@/hooks';
import { IAction } from '@/common/typings';
import { reducer } from './reducer';
import { setHeight, setLeftOffset, setState, setWidth } from './actions';
import { If } from '@/components';
import { SM_CWIDTH } from '@/common/constants/clientwidth';
export * from './ref';

const defaultHeight = 10;

const Popup = forwardRef<IPopupRef, IProps>(
  ({ children, height, width }, popupRef): ReactElement | null => {
    const ref = useRef<HTMLDivElement>(null);
    const timer = useRef<number>();
    const cWidth = useRef(document.documentElement.clientWidth);
    cWidth.current = document.documentElement.clientWidth;
    const [{ _height, _width, leftOffset, state }, dispatch] = useReducer<
      Reducer<IState, IAction<number | boolean>>
    >(reducer, {
      _height: 0,
      _width: width ?? undefined,
      leftOffset: 0,
      state: false,
    });
    const { className, addClass, removeClass } = useToggleClass('popup-visible', false);

    useEffect(() => {
      const el = ref.current;
      if (!el) return;
      const offset = el!.parentElement?.offsetWidth ? el!.parentElement?.offsetWidth / 20 : 0;
      if (!width) {
        dispatch(setLeftOffset(0));
        return;
      } else {
        dispatch(setWidth(width));
        dispatch(setLeftOffset(width / 2 - offset));
      }
    }, [width, cWidth.current]);

    useDidUpdateEffect(() => {
      if (!height) return;
      dispatch(setHeight(height));
    }, [height]);

    const onOpen = () => {
      if (document.documentElement.clientWidth < SM_CWIDTH || state) return;
      addClass();
      dispatch(setHeight(height ?? defaultHeight));
      dispatch(setState(true));
    };

    const onClose = (time: number) => {
      if (document.documentElement.clientWidth < SM_CWIDTH || !state) return;
      timer.current = setTimeout(() => {
        removeClass();
        dispatch(setHeight(0));
        dispatch(setState(false));
        clearTimeout(timer.current);
      }, time) as unknown as number;
    };

    useImperativeHandle(
      popupRef,
      () => ({
        onOpen,
        onClose,
      }),
      [state]
    );

    const popupContainer = useMemo(
      () => (
        <div
          className={'popup-box transition-2 ' + className}
          ref={ref}
          style={{
            height: _height + 'rem',
            width: _width + 'rem',
            transform: `translateX(-${leftOffset}rem)`,
          }}
        >
          <div className="triangle"></div>
          <div className="popup">{children}</div>
        </div>
      ),
      [_width, _height, leftOffset, children]
    );

    return (
      <If flag={document.documentElement.clientWidth >= SM_CWIDTH} element1={popupContainer} />
    );
  }
);
Popup.displayName = 'Popup';
Popup.defaultProps = {
  height: defaultHeight,
};
export default memo(Popup);
