interface IToken {
  accessToken: string;
}
interface IUserInfo {
  id?: number;
  nickName?: string;
  userName?: string;
  avatar?: string;
  role?: {
    id: number;
    isAdmin: boolean;
  };
}

interface ILogin {
  username: string;
  password: string;
}

interface IRegister {
  nickname: string;
  username: string;
  password: string;
  phone: string;
}

interface IChangePassword {
  oldpassword: string;
  newpassword: string;
}

export type { IToken, IUserInfo, ILogin, IRegister, IChangePassword };
