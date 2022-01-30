import { useState } from 'react';

/**
 * 切换class
 * @param className 类名
 * @returns
 */
function useToggleClass(_className: string, defaultEmpty: boolean) {
  const [className, setClassName] = useState(defaultEmpty ? '' : _className);

  const toggleClass = () => {
    const name = className === _className ? '' : _className;
    setClassName(name);
  };

  const addClass = () => {
    setClassName(_className);
  };

  const removeClass = () => {
    setClassName('');
  };
  return {
    toggleClass,
    addClass,
    removeClass,
    className,
  };
}
export { useToggleClass };
