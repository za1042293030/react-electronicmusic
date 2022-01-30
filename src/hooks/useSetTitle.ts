import { DEFAULT_TITLE } from '@/common/constants';
import { useEffect } from 'react';

function useSetTitle(title: string | undefined) {
  useEffect(() => {
    document.title = !title ? DEFAULT_TITLE : title;
  }, []);
}
export { useSetTitle };
