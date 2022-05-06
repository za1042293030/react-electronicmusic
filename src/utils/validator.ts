import { nickNameReg, passwordReg, phoneReg } from '@/common/constants';
import { Validateor } from '@/common/typings';
import api from '@/services';
import { message } from 'antd';

const nickNameValid: Validateor = (_rule, value, callback) => {
  if (!value?.trim()) callback('昵称为空');
  else if (!nickNameReg.test(value)) callback('不允许的昵称（中文字母数字组合）');
  else {
    api.checkNickNameUnique(value).then(res => {
      if (res === false) callback('昵称已存在');
      else callback();
    });
    return;
  }
  callback();
};

const phoneValid: Validateor = (_rule, value, callback) => {
  if (!phoneReg.test(value)) callback('不正确的手机号');
  else callback();
};

const userNameValid: Validateor = (_rule, value, callback) => {
  if (!value?.trim()) callback('账号为空');
  else {
    if (location.pathname.includes('login')) {
      callback();
      return;
    }
    api.checkUserNameUnique(value).then(res => {
      if (res === false) callback('账号已存在');
      else callback();
    });
    return;
  }
  callback();
};

const passwordValid: Validateor = (_rule, value, callback) => {
  if (!passwordReg.test(value)) callback('密码需要包含数字与字母');
  else callback();
};

const dynamicContentValid = (value?: string): boolean => {
  message.destroy();
  if (!value) {
    message.info('请输入内容');
    return false;
  } else if (value.length < 1 || value.length > 500) {
    message.info('内容长度在1到500个字符');
    return false;
  }
  return true;
};

const searchInputValid = (value: string): boolean => {
  message.destroy();
  if (value.trim().length > 20) {
    message.info('搜索关键词不能超过20个字符');
    return false;
  }
  return true;
};

const commentContentValid = (value?: string): boolean => {
  message.destroy();
  if (!value) return false;
  else if (value.trim().length > 200) {
    message.info('评论内容不能超过200个字符');
    return false;
  }
  return true;
};

export {
  nickNameValid,
  phoneValid,
  userNameValid,
  passwordValid,
  dynamicContentValid,
  searchInputValid,
  commentContentValid,
};
