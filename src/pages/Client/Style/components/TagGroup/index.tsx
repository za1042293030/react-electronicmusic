import { For } from '@/components';
import { Tag } from 'antd';
import React, { FC, memo, ReactElement } from 'react';
import { IProps } from './props';
import './index.less';
import { IStyle } from '@/common/typings/service';

const { CheckableTag } = Tag;

const TagGroup: FC<IProps> = ({
  tags,
  chooseId,
  emptyEl,
  onChange,
  onMouseEnter,
}): ReactElement => {
  return (
    <div className="tag-group">
      <For data={tags} emptyEl={emptyEl}>
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
TagGroup.defaultProps = {
  emptyEl: false,
};
export default memo(TagGroup);
