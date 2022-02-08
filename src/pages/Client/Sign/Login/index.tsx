import { passwordRule,userNameRule } from '@/common/constants/formRule';
import { ILogin } from '@/common/typings';
import { useSign } from '@/hooks';
import { Button,Form,Input,message,Typography } from 'antd';
import React,{ FC,ReactElement,useCallback,useState } from 'react';

const {Title} = Typography;

const Login: FC = (): ReactElement => {
  const {login} = useSign();
  const [loading,setLoading] = useState(false);
  
  const onFinish = useCallback(async (data: ILogin) => {
    setLoading(true);
    await login(data);
    setLoading(false);
  },[]);
  
  const onFinishFailed = useCallback(() => {
    message.error('登录信息有误，请检查');
  },[]);
  
  return (
    <>
      <Title level={3} className="login-title">
        登录
      </Title>
      <Form
        name="basic"
        wrapperCol={{span: 24}}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <Form.Item name="username" rules={userNameRule}>
          <Input placeholder="账号"/>
        </Form.Item>
        <Form.Item name="password" rules={passwordRule}>
          <Input.Password placeholder="密码"/>
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" style={{width: '100%'}} loading={loading}>
            登录
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};
export default Login;
