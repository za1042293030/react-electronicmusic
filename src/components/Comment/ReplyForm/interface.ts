interface IState {
  commentValue: string;
}

interface IProps {
  btnText?: string;
  submitLoading?: boolean;
  placeholder?: string;
  onSendComment?: (value: string) => void;
}

export type { IState, IProps };
