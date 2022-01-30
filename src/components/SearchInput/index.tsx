import React, { FC, memo, ReactElement, useRef } from 'react';
import './index.less';
import { SearchOutlined } from '@ant-design/icons';
import { useToggleClass } from '@/hooks';
import { IProps } from './props';
import Popup, { IPopupRef } from '@/components/Popup';

const SearchInput: FC<IProps> = ({
  placeholder,
  popup,
  width,
  children,
  onSearch,
}): ReactElement => {
  const searchRef = useRef<HTMLInputElement>(null);
  const popupRef = useRef<IPopupRef>(null);
  const { toggleClass, className } = useToggleClass('border-visible', true);

  const addClasses = async () => {
    toggleClass();
    if (!popup) return;
    popupRef.current?.onOpen();
  };

  return (
    <div
      className="search transition-5"
      style={{ width: width + 'rem' }}
      onMouseLeave={() => {
        popupRef.current?.onClose(300);
      }}
    >
      <div className={'search-input-box ' + className}>
        <input
          type="text"
          className="search-input"
          placeholder={placeholder}
          onFocus={addClasses}
          onBlur={toggleClass}
          ref={searchRef}
          onKeyUp={event => {
            if (onSearch && event.code == 'Enter') onSearch(searchRef.current!.value);
          }}
        />
        <div
          className="icon transition-5"
          onClick={() => onSearch && onSearch(searchRef.current!.value)}
        >
          <SearchOutlined />
        </div>
      </div>
      {popup && (
        <Popup ref={popupRef} height={31}>
          {children}
        </Popup>
      )}
    </div>
  );
};
export default memo(SearchInput);
