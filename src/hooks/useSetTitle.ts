import { DEFAULT_TITLE } from '@/common/constants';
import { DependencyList, useEffect } from 'react';

function useSetTitle(title: string | undefined, deps: DependencyList = []) {
  useEffect(() => {
    document.title = !title ? DEFAULT_TITLE : title;
  }, deps);
}
export { useSetTitle };
