import React from 'react';
import { Form, Input, Checkbox } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { AuthCard, AuthTitle, AuthButton, FooterLinks } from '../../styled';

const LoginAdmin: React.FC = () => {

  const onFinish = (values: any) => {
    console.log('Success:', values);
    // Add logic here to call API
    // If success, navigate('/admin') or equivalent
  };

  return (
    <AuthCard>
      <AuthTitle level={3}>Đăng nhập dành cho </AuthTitle>
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
          <Input prefix={<UserOutlined />} placeholder="Tên đăng nhập" />
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
            {/* <Link to={FORGOT_PASSWORD_ROUTE}>
              Quên mật khẩu?
            </Link> */}
          </FooterLinks>
        </Form.Item>

        <Form.Item style={{ marginBottom: 0 }}>
          <AuthButton type="primary" htmlType="submit">
            Đăng nhập
          </AuthButton>
        </Form.Item>
      </Form>
      
      {/* <CenteredText>
        Chưa có tài khoản?{' '}
        <Link to={REGISTER_ROUTE} style={{ color: '#AFA9EC', fontWeight: 500 }}>
          Đăng ký ngay
        </Link>
      </CenteredText> */}
    </AuthCard>
  );
};

export default LoginAdmin;
