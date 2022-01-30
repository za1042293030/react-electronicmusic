import { useChangeThemeColor } from '@/hooks';
import React, { FC, ReactElement } from 'react';
import { CirclePicker } from 'react-color';
import './index.less';

const ThemeColorPicker: FC = (): ReactElement => {
  const { color, handleChangeThemeColor } = useChangeThemeColor();
  return (
    <div style={{ backgroundColor: color }} className="theme-color-picker p-transition">
      <CirclePicker color={color} onChangeComplete={handleChangeThemeColor} />
    </div>
  );
};
export default ThemeColorPicker;
