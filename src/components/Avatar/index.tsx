import React, { FC, memo, ReactElement } from 'react';
import { If, LazyLoad } from '@/components';
import './index.less';
import { IProps } from './props';
import { PaperClipOutlined, UserOutlined } from '@ant-design/icons';
import DefaultImg from '@/assets/emptyImg.webp';

const Avatar: FC<IProps> = ({ id, imgSrc, title, size, editIcon, onClick }): ReactElement => {
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
          <If
            flag={!imgSrc}
            element1={<UserOutlined style={{ color: 'white' }} title={title} />}
            element2={<img src={imgSrc} alt={title} title={title} />}
          />
        </LazyLoad>
        <If
          flag={editIcon}
          element1={
            <PaperClipOutlined
              style={{
                width: '5rem',
                height: '5rem',
                fontSize: '2rem',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                position: 'absolute',
                top: 0,
                left: 0,
                color: '#ddd',
                background: 'rgba(0,0,0,0.3)',
              }}
              className="icon"
            />
          }
        />
      </div>
      <If
        flag={!title}
        element2={
          <p className="avatar-title transition-2" onClick={() => onClick && onClick(id)}>
            {title}
          </p>
        }
      />
    </div>
  );
};
Avatar.defaultProps = {
  size: 5,
  title: '',
  editIcon: false,
};
export default memo(Avatar);
