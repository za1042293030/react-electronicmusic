import { CssVar, LocalStorage } from '@/common/enums';
import {} from '@/utils';
import { useCallback, useEffect, useRef, useState } from 'react';
import { ColorResult } from 'react-color';
/**
 * 获取本地存储的颜色
 */
function useGetThemeColor() {
  useEffect(() => {
    const themeColor = localStorage.getItem(LocalStorage.THEME);
    if (!themeColor) return;
    getComputedStyle(document.querySelector(':root') as HTMLElement)!.setProperty(CssVar.THEME_COLOR, themeColor);
  }, []);
}
/**
 * 改变主题颜色
 * @returns
 */
function useChangeThemeColor() {
  const rootRef = useRef<HTMLElement>(document.querySelector(':root'));
  const [color, setColor] = useState<string>('');

  useEffect(() => {
    setColor(getComputedStyle(rootRef.current!).getPropertyValue(CssVar.THEME_COLOR));
  }, []);

  const handleChangeThemeColor = useCallback((color: ColorResult) => {
    setColor(color.hex);
    localStorage.setItem(LocalStorage.THEME, color.hex);
    rootRef.current!.style.setProperty(CssVar.THEME_COLOR, color.hex);
  }, []);

  return {
    color,
    handleChangeThemeColor,
  };
}

export { useGetThemeColor, useChangeThemeColor };
