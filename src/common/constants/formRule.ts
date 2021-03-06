import { nickNameValid, passwordValid, phoneValid, userNameValid } from '@/utils';
import { Rule } from 'antd/lib/form';

const userNameRule: Rule[] = [
  { required: true, message: '账号为空' },
  { type: 'string', min: 8, message: '账号至少8位' },
  { type: 'string', max: 16, message: '账号至多16位' },
  { validator: userNameValid, validateTrigger: 'onChange' },
];

const passwordRule: Rule[] = [
  { required: true, message: '密码为空' },
  { type: 'string', min: 10, message: '密码至少10位' },
  { type: 'string', max: 16, message: '密码至多16位' },
  { validator: passwordValid, validateTrigger: 'onChange' },
];

const phoneRule: Rule[] = [
  { required: true, message: '手机为空' },
  { type: 'string', min: 11, max: 11, message: '手机号为11位' },
  { validator: phoneValid },
];

const nickNameRule: Rule[] = [
  { type: 'string', min: 2, message: '昵称至少2位' },
  { type: 'string', max: 10, message: '昵称至多10位' },
  { validator: nickNameValid, validateTrigger: 'onChange' },
];

const playListNameRule: Rule[] = [
  { required: true, message: '歌单名称为空' },
  { type: 'string', max: 20, message: '歌单名称至多20个字符' },
];

const playListDescribeRule: Rule[] = [{ type: 'string', max: 220, message: '歌单简介至多220个字符' }];

const albumNameRule: Rule[] = [
  { required: true, message: '专辑名称为空' },
  { type: 'string', max: 20, message: '专辑名称至多20个字符' },
];

const albumDescribeRule: Rule[] = [
  {
    type: 'string',
    max: 1000,
    message: '专辑简介至多1000个字符',
  }];

const songNameRule: Rule[] = [
  { required: true, message: '歌曲名称为空' },
  { type: 'string', max: 20, message: '歌曲名称至多20个字符' },
];

const songDescribeRule: Rule[] = [{ type: 'string', max: 220, message: '歌曲简介至多220个字符' }];

export {
  userNameRule,
  passwordRule,
  phoneRule,
  nickNameRule,
  playListNameRule,
  playListDescribeRule,
  albumDescribeRule,
  albumNameRule,
  songDescribeRule,
  songNameRule
};
