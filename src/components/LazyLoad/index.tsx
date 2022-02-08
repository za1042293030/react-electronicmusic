import React, { VFC, memo, ReactElement, useEffect, useRef, useState } from 'react';
import { IProps } from './props';
import './index.less';
import { throttle } from 'lodash';
import { THROTTLE_TIME } from '@/common/constants';
import If from '@/components/If';

const LazyLoad: VFC<IProps> = ({ offset, children, width, height, loading }): ReactElement => {
  const [renderState, setRenderState] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const lazyload = () => {
    if (!ref.current || renderState) {
      clearEvents();
      return;
    }
    const top = ref.current.getBoundingClientRect().top;
    const cHeight = document.documentElement.clientHeight;
    if (top - cHeight <= offset!) setRenderState(true);
  };

  const clearEvents = () => {
    window.removeEventListener('load', lazyload, false);
    window.removeEventListener('scroll', lazyload, false);
  };

  const addEvents = () => {
    window.addEventListener('load', lazyload, false);
    if (document.readyState === 'complete') lazyload();
    window.addEventListener('scroll', throttle(lazyload, THROTTLE_TIME), false);
  };

  useEffect(() => {
    addEvents();
    return clearEvents;
  }, []);

  return (
    <If
      flag={renderState}
      element1={children}
      element2={
        <div
          style={{ width: width + 'rem', height: height + 'rem' }}
          className="lazy-load"
          ref={ref}
        >
          {loading}
        </div>
      }
    />
  );
};
LazyLoad.defaultProps = {
  offset: 50,
};
export default memo(LazyLoad);
