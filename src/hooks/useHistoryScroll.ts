import { useHistory } from 'react-router-dom';

function useHistoryScroll() {
  const history = useHistory();

  const push = (path: string) => {
    history.push(path);
    window.scroll(0, 0);
  };
  return {
    push
  }
}
export { useHistoryScroll };
