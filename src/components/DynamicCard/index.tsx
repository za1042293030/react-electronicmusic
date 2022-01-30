import { Avatar, For, If, LazyLoad, MusicCard } from '@/components';
import React, { FC, memo, ReactElement, useCallback, useMemo, useState } from 'react';
import './index.less';
import { EyeOutlined, LikeOutlined, MessageOutlined, ShareAltOutlined } from '@ant-design/icons';
import { Image } from 'antd';
import { IProps } from './props';
import { XS_CWIDTH } from '@/common/constants/clientwidth';
import { isEmpty } from 'lodash';
import { IComment, IDynamicPic, IDynamicWithComment } from '@/common/typings';
import moment from 'moment';
import { Comment } from '..';
import { CommentType } from '@/common/enums';
import ReplyForm from '../Comment/ReplyForm';
import { useHistory } from 'react-router-dom';

interface IState {
  visible: boolean;
  current: number;
  hasMore: boolean;
  comments: IComment[];
  pageIndex: number;
}

const DynamicCard: FC<IProps & IDynamicWithComment> = ({
  id,
  createTime,
  content,
  createBy,
  likedCount,
  commentedCount,
  song,
  pictures,
  openComment,
  onLike,
  onComment,
  onShare,
  onClickSong,
  onSendComment,
  onSendReplyComment,
}): ReactElement => {
  const [{ visible, current }, setState] = useState<IState>({
    visible: false,
    current: 0,
    hasMore: true,
    comments: [],
    pageIndex: 1,
  });
  const history = useHistory();
  const pictureContainerChildren = useCallback(
    (picture: IDynamicPic, index: number) => (
      <div
        className="picture-container"
        onClick={() =>
          setState(state => ({
            ...state,
            current: index,
            visible: true,
          }))
        }
        key={picture?.id}
      >
        <LazyLoad>
          <img src={picture.src} />
        </LazyLoad>
        <div className="perview">
          <EyeOutlined style={{ color: 'white', fontSize: '2rem', fontWeight: 'bolder' }} />
        </div>
      </div>
    ),
    [pictures]
  );

  const imagePreview = useMemo(
    () => (
      <LazyLoad>
        <div style={{ display: 'none' }}>
          <Image.PreviewGroup
            preview={{
              visible,
              onVisibleChange: (visible: boolean) => {
                setState(state => ({
                  ...state,
                  visible,
                }));
              },
              current,
              destroyOnClose: true,
            }}
          >
            <For data={pictures!}>
              {(picture: IDynamicPic) => <Image src={picture?.src} key={picture?.id} />}
            </For>
          </Image.PreviewGroup>
        </div>
      </LazyLoad>
    ),
    [pictures, visible, current]
  );
  const dynamicMusicCard = useMemo(() => {
    return (
      <div className="music-card">
        <MusicCard
          height={5}
          row
          src={song?.cover}
          style={{ cursor: 'pointer' }}
          onClick={() => song && onClickSong && onClickSong(song)}
          fileSrc={song?.file}
        >
          <div
            className="card-child"
            onClick={() => {
              history.push('/client/song/' + song?.id);
            }}
          >
            <p>
              {song?.name} <span>{song?.artists?.map(artist => artist?.nickName).join(',')}</span>
            </p>
          </div>
        </MusicCard>
      </div>
    );
  }, [song, onClickSong]);
  return (
    <div className="dynamic-card">
      <div className="head">
        <div className="dynamic-card-left">
          <Avatar size={4} title={createBy?.nickName} imgSrc={createBy?.avatar}></Avatar>
        </div>
        <p className="time">{moment(createTime).utcOffset(8).fromNow()}</p>
      </div>
      <div
        className="dynamic-card-content"
        style={
          document.documentElement.clientWidth < XS_CWIDTH
            ? { display: 'flex', flexDirection: 'column', alignItems: 'center' }
            : undefined
        }
      >
        <div className="dynamic-card-text">
          <span className="text">{content}</span>
        </div>
        <If flag={isEmpty(song)} element2={dynamicMusicCard} />
        <If
          flag={isEmpty(pictures)}
          element2={
            <div className="picture-group">
              <For data={pictures!}>{pictureContainerChildren}</For>
            </div>
          }
        />
      </div>
      <div className="dynamic-card-bottom">
        <div className="dynamic-card-icon">
          <div>
            <LikeOutlined
              style={{ fontSize: '1.6rem', cursor: 'pointer' }}
              onClick={() => onLike && onLike(id)}
            />
            <span className="dynamic-icon-text">{likedCount}</span>
          </div>
          <div>
            <MessageOutlined
              style={{ fontSize: '1.6rem', cursor: 'pointer' }}
              onClick={() => onComment && onComment(id)}
            />
            <span className="dynamic-icon-text">{commentedCount}</span>
          </div>
          <ShareAltOutlined
            style={{ fontSize: '1.6rem', cursor: 'pointer' }}
            onClick={() => onShare && onShare(id)}
          />
        </div>
      </div>
      <If
        flag={openComment}
        element1={
          <>
            <ReplyForm onSendComment={onSendComment} />
            <Comment type={CommentType.DYNAMIC} id={id} onSendReplyComment={onSendReplyComment} />
          </>
        }
      />
      <If flag={isEmpty(pictures)} element2={imagePreview} />
    </div>
  );
};
DynamicCard.defaultProps = {
  comments: [],
};

export default memo(DynamicCard);
