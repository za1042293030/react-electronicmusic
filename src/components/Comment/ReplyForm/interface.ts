interface IState {
  commentValue: string;
}

interface IProps {
  btnText?: string;
  submitLoading?: boolean;
  onSendComment?: (value: string) => void;
}

export type { IState,IProps };
