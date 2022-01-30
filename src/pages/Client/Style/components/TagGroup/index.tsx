import { For } from '@/components';
import { Tag } from 'antd';
import React, { FC, memo, ReactElement } from 'react';
import { IProps } from './props';
import './index.less';
import { IStyle } from '@/common/typings/service';

const { CheckableTag } = Tag;

const TagGroup: FC<IProps> = ({ tags, chooseId, onChange, onMouseEnter }): ReactElement => {
  return (
    <div className="tag-group">
      <For data={tags}>
        {(tag: IStyle) => (
          <div key={tag.id} onMouseEnter={() => onMouseEnter && onMouseEnter(tag)}>
            <CheckableTag
              checked={chooseId === tag.id ? true : false}
              onChange={() => onChange && onChange(tag)}
            >
              {tag.name}
            </CheckableTag>
          </div>
        )}
      </For>
    </div>
  );
};
export default memo(TagGroup);
