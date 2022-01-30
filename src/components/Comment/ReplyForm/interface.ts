interface IState {
  commentValue: string;
}
interface IProps {
  btnText?: string;
  onSendComment?: (value: string) => void;
}
export type { IState, IProps };
