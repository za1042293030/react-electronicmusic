import React, { VFC, memo, ReactElement } from 'react';
import { If, LazyLoad } from '@/components';
import './index.less';
import { IProps } from './props';
import LoadingImg from '@/assets/emptyImg.webp';

const MusicCard: VFC<IProps> = ({
  src,
  imgTitle,
  className,
  width,
  height,
  children,
  row,
  style,
  fileSrc,
  imgWidth,
  imgHeight,
  lazyLoad,
  playBtn,
  onClick,
}): ReactElement => {
  const cardClassName = [row ? 'card-row' : 'card', 'transition-2', className].join(' ');

  const img = (
    <img
      src={src}
      title={imgTitle}
      alt={imgTitle}
      style={{ width: imgWidth + 'rem', height: imgHeight + 'rem' }}
    />
  );
  return (
    <div
      className={cardClassName}
      style={{ width: width + 'rem', height: height + 'rem', ...style }}
    >
      <div className="card-top transition-2" onClick={() => onClick && onClick(fileSrc)}>
        <If
          flag={lazyLoad}
          element1={<LazyLoad loading={<img src={LoadingImg} />}>{img}</LazyLoad>}
          element2={img}
        />
        <If flag={playBtn} element1={<div className="play-btn"></div>} />
      </div>
      <If flag={!children} element2={<div className="card-bottom transition-2">{children}</div>} />
    </div>
  );
};
MusicCard.defaultProps = {
  row: false,
  lazyLoad: true,
  playBtn: true,
};
export default memo(MusicCard);
