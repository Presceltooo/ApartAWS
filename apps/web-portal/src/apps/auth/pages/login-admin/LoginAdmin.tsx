import React from 'react';
import { Form, Input, Checkbox } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { AuthCard, AuthTitle, AuthButton, FooterLinks } from '../../styled';
import { useHandleLoginAdmin } from '../../hooks/useHandleLoginAdmin';

const LoginAdmin: React.FC = () => {
  const { handleLoginAdmin, isPending } = useHandleLoginAdmin();

  const onFinish = (values: { username: string; password: string }) => {
    handleLoginAdmin({ email: values.username, password: values.password });
  };

  return (
    <AuthCard>
      <AuthTitle level={3}>Đăng nhập dành cho Quản trị viên</AuthTitle>
      <Form
        name="normal_login_admin"
        initialValues={{ remember: true }}
        onFinish={onFinish}
        size="large"
      >
        <Form.Item
          name="username"
          rules={[{ required: true, message: 'Vui lòng nhập tên đăng nhập!' }]}
        >
          <Input prefix={<UserOutlined />} placeholder="Email / Tên đăng nhập" />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
        >
          <Input.Password
            prefix={<LockOutlined />}
            placeholder="Mật khẩu"
          />
        </Form.Item>
        <Form.Item>
          <FooterLinks>
            <Form.Item name="remember" valuePropName="checked" noStyle>
              <Checkbox style={{ color: '#CECBF6' }}>Ghi nhớ đăng nhập</Checkbox>
            </Form.Item>
          </FooterLinks>
        </Form.Item>

        <Form.Item style={{ marginBottom: 0 }}>
          <AuthButton type="primary" htmlType="submit" loading={isPending}>
            {isPending ? 'Đang đăng nhập…' : 'Đăng nhập'}
          </AuthButton>
        </Form.Item>
      </Form>
    </AuthCard>
  );
};

export default LoginAdmin;
