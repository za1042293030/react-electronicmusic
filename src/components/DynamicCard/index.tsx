import { Avatar, For, If, LazyLoad, MusicCard } from '@/components';
import React, { FC, memo, ReactElement, useCallback, useMemo, useState } from 'react';
import './index.less';
import {
  EyeInvisibleOutlined,
  EyeOutlined,
  MessageOutlined,
} from '@ant-design/icons';
import { Image, Popconfirm } from 'antd';
import { IProps } from './props';
import { XS_CWIDTH } from '@/common/constants/clientwidth';
import { isEmpty } from 'lodash';
import { IDynamicPic, IDynamicWithComment } from '@/common/typings';
import moment from 'moment';
import { Comment } from '..';
import { CommentType } from '@/common/enums';
import ReplyForm from '../Comment/ReplyForm';
import { useHistoryScroll, useUserInfo } from '@/hooks';

interface IState {
  visible: boolean;
  current: number;
  popVisible: boolean;
}

const DynamicCard: FC<IProps & IDynamicWithComment> = ({
                                                         id,
                                                         createTime,
                                                         content,
                                                         createBy,
                                                         commentedCount,
                                                         song,
                                                         pictures,
                                                         submitLoading,
                                                         replyLoading,
                                                         openComment,
                                                         subReplyLoading,
                                                         isPublish,
                                                         deleteLoading,
                                                         onComment,
                                                         onClickSong,
                                                         onSendComment,
                                                         onSendReplyComment,
                                                         onSendSubReplyComment,
                                                         onDelete,
                                                         onDeleteComment,
                                                       }): ReactElement => {
  const [{ visible, current, popVisible }, setState] = useState<IState>({
    visible: false,
    current: 0,
    popVisible: false,
  });
  const { push } = useHistoryScroll();
  const { userInfo } = useUserInfo();
  const pictureContainerChildren = useCallback(
    (picture: IDynamicPic, index: number) => (
      <div
        className='picture-container'
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
          <img
            src={picture.src}
            onLoad={e => {
              const target = e.target as HTMLImageElement;
              if (target.width > target.height) target.className = 'dynamic-picture-transverse';
              else target.className = 'dynamic-picture-vertical';
            }}
          />
        </LazyLoad>
        <div className='perview'>
          <EyeOutlined style={{ color: 'white', fontSize: '2rem', fontWeight: 'bolder' }} />
        </div>
      </div>
    ),
    [pictures],
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
    [pictures, visible, current],
  );
  const dynamicMusicCard = useMemo(() => {
    return (
      <div className='music-card'>
        <MusicCard
          height={5}
          row
          src={song?.cover}
          style={{ cursor: 'pointer' }}
          onClick={() => song && onClickSong && onClickSong(song)}
          fileSrc={song?.file}
        >
          <div
            className='card-child'
            onClick={() => {
              push('/client/song/' + song?.id);
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
    <div className='dynamic-card'>
      <div className='head'>
        <div className='dynamic-card-left'>
          <Avatar
            size={4}
            title={createBy?.nickName}
            imgSrc={createBy?.avatar}
            onClick={() => {
              push('/client/personalcenter/' + createBy?.id);
            }}
          ></Avatar>
        </div>
        <div className='dynamic-actions'>
          <span>{moment(createTime).utcOffset(8).fromNow()} </span>
          <If
            flag={deleteLoading !== undefined && userInfo?.id === createBy?.id}
            element1={
              <>
                <Popconfirm
                  title='确定要删除吗？'
                  onConfirm={async () => {
                    onDelete && (await onDelete(id));
                    setState(state => ({
                      ...state,
                      popVisible: false,
                    }));
                  }}
                  onCancel={() =>
                    setState(state => ({
                      ...state,
                      popVisible: false,
                    }))
                  }
                  okText='确认'
                  cancelText='取消'
                  okButtonProps={{ loading: deleteLoading }}
                  visible={popVisible}
                >
                  <a
                    className='dynamic-delete'
                    onClick={() =>
                      setState(state => ({
                        ...state,
                        popVisible: true,
                      }))
                    }
                  >
                    删除
                  </a>
                </Popconfirm>
              </>
            }
          />
        </div>
        <If
          flag={isPublish || isPublish === undefined}
          element2={
            <span className='private' title='仅自己可见'>
              私密
              <EyeInvisibleOutlined style={{ padding: '0 .2rem' }} />
            </span>
          }
        />
      </div>
      <div
        className='dynamic-card-content'
        style={
          document.documentElement.clientWidth < XS_CWIDTH
            ? { display: 'flex', flexDirection: 'column', alignItems: 'center' }
            : undefined
        }
      >
        <div className='dynamic-card-text'>
          <span className='text'>{content}</span>
        </div>
        <If flag={isEmpty(song)} element2={dynamicMusicCard} />
        <If
          flag={isEmpty(pictures)}
          element2={
            <div className='picture-group'>
              <For data={pictures!}>{pictureContainerChildren}</For>
            </div>
          }
        />
      </div>
      <div className='dynamic-card-bottom'>
        <div className='dynamic-card-icon'>
          <div>
            <MessageOutlined
              style={{ fontSize: '1.6rem', cursor: 'pointer' }}
              onClick={() => onComment && onComment(id)}
            />
            <span className='dynamic-icon-text'>{commentedCount}</span>
          </div>
        </div>
      </div>
      <If
        flag={openComment}
        element1={
          <>
            <ReplyForm onSendComment={onSendComment} submitLoading={submitLoading}
                       placeholder={'评论一下@' + createBy.nickName + '怎么样'} />
            <Comment
              type={CommentType.DYNAMIC}
              id={id}
              onSendReplyComment={onSendReplyComment}
              onSendSubReplyComment={onSendSubReplyComment}
              replyLoading={replyLoading}
              subReplyLoading={subReplyLoading}
              onDeleteComment={onDeleteComment}
            />
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
