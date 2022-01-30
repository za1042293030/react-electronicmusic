import { TOKEN } from '@/common/constants';
import { IDispatch, IJwtPayload, ILogin, IRegister } from '@/common/typings';
import api from '@/services';
import { message } from 'antd';
import { decode } from 'jsonwebtoken';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { useUserInfo } from '.';

function useSign() {
  const history = useHistory();
  const { saveUserInfo, clearUserInfo, saveAdminInfo } = useUserInfo();

  const login = async (data: ILogin) => {
    message.loading('登录中');
    const token = await api.login(data);
    message.destroy();
    if (!token) {
      message.error('登录失败');
      return;
    }
    localStorage.setItem(TOKEN, token.accessToken);
    const info = decode(token.accessToken) as IJwtPayload;
    saveUserInfo(info.id);
    message.success('登录成功');
    history.replace('/');
  };

  const register = async (data: IRegister) => {
    message.loading('注册中');
    const token = await api.register(data);
    message.destroy();
    if (!token) {
      message.error('注册失败');
      return;
    }
    localStorage.setItem(TOKEN, token.accessToken);
    const info = decode(token.accessToken) as IJwtPayload;
    saveUserInfo(info.id);
    message.success('注册成功');
    history.replace('/');
  };

  const loginAdmin = async (data: ILogin) => {
    message.loading('登录中');
    const token = await api.loginAdmin(data);
    message.destroy();
    if (!token) {
      return;
    }
    localStorage.setItem(TOKEN, token.accessToken);
    const info = decode(token.accessToken) as IJwtPayload;
    saveAdminInfo(info.id);
    history.replace('/admin/main', { admin: true });
  };

  const logOut = () => {
    localStorage.removeItem(TOKEN);
    clearUserInfo();
    history.replace('/');
    message.success('退出成功');
  };

  return {
    login,
    register,
    loginAdmin,
    logOut,
  };
}
export { useSign };
