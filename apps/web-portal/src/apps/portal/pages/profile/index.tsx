import React, { useEffect } from 'react';
import { Form, Input, Button, Card, Typography, message } from 'antd';
import { UserOutlined, PhoneOutlined, HomeOutlined } from '@ant-design/icons';
import { useGetMe } from '../../../auth/services/query';
import { useUpdateProfile } from '../../../auth/services/mutation';

const { Title } = Typography;

const Profile: React.FC = () => {
  const [form] = Form.useForm();
  const { data: userData, isLoading: isLoadingMe, refetch } = useGetMe();
  const { mutate: updateProfile, isPending: isUpdating } = useUpdateProfile();

  useEffect(() => {
    if (userData?.data) {
      form.setFieldsValue({
        fullName: userData.data.fullName,
        phone: userData.data.phone,
        address: userData.data.address,
      });
    }
  }, [userData, form]);

  const onFinish = (values: any) => {
    updateProfile(values, {
      onSuccess: () => {
        message.success('Cập nhật thông tin thành công');
        refetch();
      },
      onError: (err: any) => {
        message.error(err?.response?.data?.message || 'Có lỗi xảy ra khi cập nhật');
      }
    });
  };

  if (isLoadingMe) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{ maxWidth: 600, margin: '40px auto' }}>
      <Card>
        <Title level={3} style={{ textAlign: 'center', marginBottom: 24 }}>Thông tin cá nhân</Title>
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
        >
          <Form.Item
            name="fullName"
            label="Họ và tên"
            rules={[{ required: true, message: 'Vui lòng nhập họ và tên!' }]}
          >
            <Input prefix={<UserOutlined />} placeholder="Ví dụ: Nguyễn Văn A" size="large" />
          </Form.Item>

          <Form.Item
            name="phone"
            label="Số điện thoại"
            rules={[
              { required: true, message: 'Vui lòng nhập số điện thoại!' },
              { pattern: /^[0-9]{10,11}$/, message: 'Số điện thoại không hợp lệ!' }
            ]}
          >
            <Input prefix={<PhoneOutlined />} placeholder="Ví dụ: 0987654321" size="large" />
          </Form.Item>

          <Form.Item
            name="address"
            label="Địa chỉ"
          >
            <Input prefix={<HomeOutlined />} placeholder="Ví dụ: 123 Đường X, Quận Y" size="large" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" size="large" block loading={isUpdating}>
              Cập nhật hồ sơ
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default Profile;
