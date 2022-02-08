import { TOKEN } from '@/common/constants';
import { IChangePassword, IDispatch, IJwtPayload, ILogin, IRegister } from '@/common/typings';
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
    message.destroy();
    message.loading({
      content: '登录中',
      key: 1,
    });
    const token = await api.login(data);
    message.destroy(1);
    if (!token) {
      return;
    }
    localStorage.setItem(TOKEN, token.accessToken);
    const info = decode(token.accessToken) as IJwtPayload;
    saveUserInfo(info.id);
    message.success('登录成功');
    history.replace('/');
  };

  const register = async (data: IRegister) => {
    message.destroy();
    message.loading({
      content: '注册中',
      key: 1,
    });
    const token = await api.register(data);
    message.destroy(1);
    if (!token) return;
    localStorage.setItem(TOKEN, token.accessToken);
    const info = decode(token.accessToken) as IJwtPayload;
    saveUserInfo(info.id);
    message.success('注册成功');
    history.replace('/');
  };

  const loginAdmin = async (data: ILogin) => {
    message.destroy();
    message.loading({
      content: '登录中',
      key: 1,
    });
    const token = await api.loginAdmin(data);
    message.destroy(1);
    if (!token) return;
    localStorage.setItem(TOKEN, token.accessToken);
    const info = decode(token.accessToken) as IJwtPayload;
    saveAdminInfo(info.id);
    message.success('登录成功');
    history.replace('/admin/main', { admin: true });
  };

  const logOut = (redto = '/', msg = '退出成功') => {
    localStorage.removeItem(TOKEN);
    clearUserInfo();
    history.replace(redto);
    message.success(msg);
  };

  const changePassword = async (data: IChangePassword) => {
    if (!(await api.changePassword(data))) return;
    logOut('/client/sign/login', '修改成功，请重新登录');
  };

  return {
    login,
    register,
    loginAdmin,
    logOut,
    changePassword,
  };
}
export { useSign };
