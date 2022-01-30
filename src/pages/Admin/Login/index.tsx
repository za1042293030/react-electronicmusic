import { passwordRule, userNameRule } from '@/common/constants/formRule';
import { ILogin, IRouterProps } from '@/common/typings';
import { useSetTitle, useSign } from '@/hooks';
import { Button, Form, Input, message, Typography } from 'antd';
import React, { FC, ReactElement, useCallback } from 'react';
import './index.less';

const { Title } = Typography;

const Login: FC<IRouterProps> = ({ route }): ReactElement => {
  useSetTitle(route.meta?.title);
  const { loginAdmin } = useSign();

  const onFinish = useCallback(async (data: ILogin) => {
    await loginAdmin(data);
  }, []);

  const onFinishFailed = useCallback(() => {
    message.error('登录信息有误，请检查');
  }, []);

  return (
    <div className="admin-login">
      <div className="admin-login-form-container">
        <Title level={2}>后台管理</Title>
        <Form
          className="admin-login-form"
          name="basic"
          wrapperCol={{ span: 24 }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item name="username" rules={userNameRule}>
            <Input placeholder="账号" />
          </Form.Item>
          <Form.Item name="password" rules={passwordRule}>
            <Input.Password placeholder="密码" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
              登录
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};
export default Login;
