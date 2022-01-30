import React, { FC, memo, ReactElement, useMemo } from 'react';
import { If, LazyLoad } from '@/components';
import './index.less';
import { IProps } from './props';
import { UserOutlined } from '@ant-design/icons';
import DefaultImg from '@/assets/emptyImg.webp';

const Avatar: FC<IProps> = ({ id, imgSrc, title, size, onClick }): ReactElement => {
  const titleContainer = useMemo(
    () => (
      <p className="avatar-title transition-2" onClick={() => onClick && onClick(id)}>
        {title}
      </p>
    ),
    [onClick, title]
  );
  const avaterImg = useMemo(() => <img src={imgSrc} alt={title} title={title} />, [imgSrc, title]);
  const voidAvaterImg = useMemo(
    () => <UserOutlined style={{ color: 'white' }} title={title} />,
    []
  );
  return (
    <div className="avatar">
      <div
        className="avatar-img"
        style={{ width: size + 'rem', height: size + 'rem' }}
        onClick={() => onClick && onClick(id)}
      >
        <LazyLoad
          loading={<img src={DefaultImg} style={{ width: size + 'rem', height: size + 'rem' }} />}
        >
          <If flag={!imgSrc} element1={voidAvaterImg} element2={avaterImg} />
        </LazyLoad>
      </div>
      <If flag={!title} element2={titleContainer} />
    </div>
  );
};
Avatar.defaultProps = {
  size: 5,
  title: '',
};
export default memo(Avatar);
