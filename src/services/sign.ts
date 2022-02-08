import { IChangePassword, ILogin, IRegister, IToken, IUserInfo } from '@/common/typings';
import { ajax } from './ajax';

async function login(data: ILogin): Promise<IToken | null | undefined> {
  return (
    await ajax<IToken>({
      url: '/api/auth/login',
      data,
      method: 'POST',
    })
  )?.data.data;
}
async function loginAdmin(data: ILogin): Promise<IToken | null | undefined> {
  return (
    await ajax<IToken>({
      url: '/api/auth/loginAdmin',
      data,
      method: 'POST',
    })
  )?.data.data;
}

async function register(data: IRegister): Promise<IToken | null | undefined> {
  return (
    await ajax<IToken>({
      url: '/api/auth/register',
      data,
      method: 'POST',
    })
  )?.data.data;
}

async function checkUserNameUnique(username: string): Promise<boolean | null | undefined> {
  return (
    await ajax<boolean>({
      url: '/api/auth/checkUserNameUnique?username=' + username,
    })
  )?.data.data;
}

async function checkNickNameUnique(nickname: string): Promise<boolean | null | undefined> {
  return (
    await ajax<boolean>({
      url: '/api/auth/checkNickNameUnique?nickname=' + nickname,
    })
  )?.data.data;
}

async function getUserInfo(id: number): Promise<IUserInfo | null | undefined> {
  return (
    await ajax<IUserInfo>({
      url: '/api/user/getUserInfo?id=' + id,
    })
  )?.data.data;
}

async function getAdminInfo(id: number): Promise<IUserInfo | null | undefined> {
  return (
    await ajax<IUserInfo>({
      url: '/api/user/getAdminInfo?id=' + id,
    })
  )?.data.data;
}

async function changePassword(data: IChangePassword): Promise<boolean | null | undefined> {
  return (
    await ajax<boolean>({
      url: '/api/auth/changePassword',
      method: 'POST',
      data,
    })
  )?.data.data;
}

export {
  login,
  getUserInfo,
  register,
  checkUserNameUnique,
  checkNickNameUnique,
  loginAdmin,
  getAdminInfo,
  changePassword
};
