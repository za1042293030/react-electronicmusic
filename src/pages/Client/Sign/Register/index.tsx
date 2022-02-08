import { nickNameRule,passwordRule,phoneRule,userNameRule } from '@/common/constants/formRule';
import { IRegister } from '@/common/typings';
import { useSign } from '@/hooks';
import { Button,Form,Input,message,Typography } from 'antd';
import React,{ FC,ReactElement,useCallback,useState } from 'react';

const {Title} = Typography;

const Register: FC = (): ReactElement => {
  const {register} = useSign();
  const [loading,setLoading] = useState(false);
  
  const onFinish = useCallback(async (data: IRegister) => {
    setLoading(true);
    await register(data);
    setLoading(false);
  },[]);
  
  const onFinishFailed = useCallback(() => {
    message.error('注册信息有误，请检查');
  },[]);
  
  return (
    <>
      <Title level={3} className="login-title">
        注册
      </Title>
      <Form
        name="basic"
        wrapperCol={{span: 24}}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <Form.Item name="nickname" rules={nickNameRule}>
          <Input placeholder="昵称"/>
        </Form.Item>
        <Form.Item name="username" rules={userNameRule}>
          <Input placeholder="账号"/>
        </Form.Item>
        <Form.Item name="password" rules={passwordRule}>
          <Input.Password placeholder="密码"/>
        </Form.Item>
        <Form.Item name="phone" rules={phoneRule}>
          <Input placeholder="手机号"/>
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" style={{width: '100%'}} loading={loading}>
            注册
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};
export default Register;
