import { Button, Input } from 'antd';
import React, { FC, ReactElement, useState } from 'react';
import { IProps, IState } from './interface';
import './index.less';

const { TextArea } = Input;

const ReplyForm: FC<IProps> = ({ onSendComment, btnText, submitLoading }): ReactElement => {
  const [{ commentValue }, setState] = useState<IState>({
    commentValue: '',
  });
  return (
    <div className="add-comment-form">
      <TextArea
        rows={2}
        className="comment-textarea"
        value={commentValue}
        onChange={e =>
          setState(state => ({
            ...state,
            commentValue: e.target.value,
          }))
        }
      />
      <div className="send-comment">
        <Button
          htmlType="submit"
          type="primary"
          loading={submitLoading}
          onClick={() => {
            if (onSendComment) {
              onSendComment(commentValue);
              setState(state => ({
                ...state,
                commentValue: '',
              }));
            }
          }}
        >
          {btnText ?? '评论'}
        </Button>
      </div>
    </div>
  );
};
export default ReplyForm;
