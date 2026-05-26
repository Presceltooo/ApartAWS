import React, { useEffect } from 'react';
import { Form, Input, App } from 'antd';
import { UserOutlined, PhoneOutlined, HomeOutlined, MailOutlined, LockOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { useGetMe } from '../../../auth/services/query';
import { useUpdateProfile, useChangePassword } from '../../../auth/services/mutation';
import {
  ProfileWrapper,
  ProfileHeader,
  AvatarCircle,
  ProfileInfo,
  ProfileName,
  ProfileEmail,
  RoleBadge,
  ProfileGrid,
  ProfileCard,
  CardTitle,
  CardSubtitle,
  FormSectionTitle,
  SaveButton
} from './styles/styled';

const Profile: React.FC = () => {
  const { t } = useTranslation('portal');
  const { message } = App.useApp();
  const [profileForm] = Form.useForm();
  const [passwordForm] = Form.useForm();

  const { data: userData, isLoading: isLoadingMe, refetch } = useGetMe();
  const { mutate: updateProfile, isPending: isUpdating } = useUpdateProfile();
  const { mutate: changePassword, isPending: isChangingPassword } = useChangePassword();

  useEffect(() => {
    if (userData?.data) {
      profileForm.setFieldsValue({
        fullName: userData.data.fullName,
        phone: userData.data.phone,
        address: userData.data.address,
      });
    }
  }, [userData, profileForm]);

  const handleUpdateProfile = (values: any) => {
    updateProfile(values, {
      onSuccess: () => {
        message.success(t('profile.msg_update_success', 'Cập nhật thông tin thành công'));
        refetch();
      },
      onError: (err: any) => {
        message.error(err?.response?.data?.message || t('profile.msg_update_error', 'Có lỗi xảy ra khi cập nhật thông tin'));
      }
    });
  };

  const handleChangePassword = (values: any) => {
    changePassword({
      oldPassword: values.oldPassword,
      newPassword: values.newPassword,
    }, {
      onSuccess: () => {
        message.success(t('profile.msg_password_success', 'Đổi mật khẩu thành công'));
        passwordForm.resetFields();
      },
      onError: (err: any) => {
        message.error(err?.response?.data?.message || t('profile.msg_password_error', 'Có lỗi xảy ra khi đổi mật khẩu'));
      }
    });
  };

  if (isLoadingMe) {
    return (
      <ProfileWrapper style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '40rem' }}>
        <div style={{ fontSize: '1.6rem', color: '#8C7169' }}>Loading...</div>
      </ProfileWrapper>
    );
  }

  const userFullName = userData?.data?.fullName || 'User';
  const userInitials = userFullName
    .split(' ')
    .map((name: string) => name[0])
    .join('')
    .slice(0, 2);

  // Map roles to translations
  const getRoleLabel = (role: string) => {
    switch (role?.toUpperCase()) {
      case 'TENANT':
        return t('profile.role_tenant', 'Khách thuê (Tenant)');
      case 'OWNER':
        return t('profile.role_owner', 'Chủ căn hộ (Owner)');
      case 'ADMIN':
        return t('profile.role_admin', 'Quản trị viên (Admin)');
      default:
        return role;
    }
  };

  return (
    <ProfileWrapper>
      {/* Editorial Profile Header */}
      <ProfileHeader>
        <AvatarCircle>{userInitials}</AvatarCircle>
        <ProfileInfo>
          <ProfileName>{userFullName}</ProfileName>
          <ProfileEmail>
            <MailOutlined style={{ marginRight: '0.6rem' }} />
            {userData?.data?.email}
          </ProfileEmail>
          <RoleBadge>{getRoleLabel(userData?.data?.role || '')}</RoleBadge>
        </ProfileInfo>
      </ProfileHeader>

      <ProfileGrid>
        {/* Account Details Card */}
        <ProfileCard>
          <CardTitle>{t('profile.title', 'Thông tin cá nhân')}</CardTitle>
          <CardSubtitle>{t('profile.subtitle', 'Quản lý và cập nhật thông tin tài khoản Domin Tactic của bạn.')}</CardSubtitle>

          <Form
            form={profileForm}
            layout="vertical"
            onFinish={handleUpdateProfile}
            requiredMark={false}
          >
            <FormSectionTitle>{t('profile.section_personal', 'Thông tin cá nhân')}</FormSectionTitle>

            {/* Email (Read only) */}
            <Form.Item label={t('profile.email', 'Địa chỉ Email')}>
              <Input
                prefix={<MailOutlined />}
                value={userData?.data?.email}
                disabled
                size="large"
              />
            </Form.Item>

            {/* Full Name */}
            <Form.Item
              name="fullName"
              label={t('profile.fullName', 'Họ và tên')}
              rules={[{ required: true, message: t('profile.validation.required_fullName', 'Vui lòng nhập họ và tên!') }]}
            >
              <Input
                prefix={<UserOutlined />}
                placeholder={t('profile.fullName_placeholder', 'Nhập họ và tên của bạn')}
                size="large"
              />
            </Form.Item>

            {/* Phone */}
            <Form.Item
              name="phone"
              label={t('profile.phone', 'Số điện thoại')}
              rules={[
                { required: true, message: t('profile.validation.required_phone', 'Vui lòng nhập số điện thoại!') },
                { pattern: /^[0-9]{10,11}$/, message: t('profile.validation.invalid_phone', 'Số điện thoại không hợp lệ!') }
              ]}
            >
              <Input
                prefix={<PhoneOutlined />}
                placeholder={t('profile.phone_placeholder', 'Nhập số điện thoại')}
                size="large"
              />
            </Form.Item>

            {/* Address */}
            <Form.Item
              name="address"
              label={t('profile.address', 'Địa chỉ')}
            >
              <Input
                prefix={<HomeOutlined />}
                placeholder={t('profile.address_placeholder', 'Nhập địa chỉ của bạn')}
                size="large"
              />
            </Form.Item>

            <Form.Item style={{ marginTop: '3rem', marginBottom: 0 }}>
              <SaveButton type="primary" htmlType="submit" size="large" loading={isUpdating}>
                {t('profile.btn_update', 'Cập nhật hồ sơ')}
              </SaveButton>
            </Form.Item>
          </Form>
        </ProfileCard>

        {/* Security & Password Card */}
        <ProfileCard>
          <CardTitle>{t('profile.section_security', 'Mật khẩu & Bảo mật')}</CardTitle>
          <CardSubtitle>{t('profile.section_security', 'Đổi mật khẩu để nâng cao tính bảo mật cho tài khoản.')}</CardSubtitle>

          <Form
            form={passwordForm}
            layout="vertical"
            onFinish={handleChangePassword}
            requiredMark={false}
          >
            <FormSectionTitle>
              <LockOutlined style={{ marginRight: '0.6rem' }} />
              {t('profile.btn_change_password', 'Đổi mật khẩu')}
            </FormSectionTitle>

            {/* Current Password */}
            <Form.Item
              name="oldPassword"
              label={t('profile.oldPassword', 'Mật khẩu hiện tại')}
              rules={[{ required: true, message: t('profile.validation.required_oldPassword', 'Vui lòng nhập mật khẩu hiện tại!') }]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder={t('profile.oldPassword_placeholder', 'Nhập mật khẩu hiện tại')}
                size="large"
              />
            </Form.Item>

            {/* New Password */}
            <Form.Item
              name="newPassword"
              label={t('profile.newPassword', 'Mật khẩu mới')}
              rules={[{ required: true, message: t('profile.validation.required_newPassword', 'Vui lòng nhập mật khẩu mới!') }]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder={t('profile.newPassword_placeholder', 'Nhập mật khẩu mới')}
                size="large"
              />
            </Form.Item>

            {/* Confirm Password */}
            <Form.Item
              name="confirmPassword"
              label={t('profile.confirmPassword', 'Xác nhận mật khẩu mới')}
              dependencies={['newPassword']}
              rules={[
                { required: true, message: t('profile.validation.required_confirmPassword', 'Vui lòng xác nhận mật khẩu mới!') },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('newPassword') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error(t('profile.validation.password_mismatch', 'Mật khẩu xác nhận không khớp!')));
                  },
                }),
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder={t('profile.confirmPassword_placeholder', 'Xác nhận mật khẩu mới')}
                size="large"
              />
            </Form.Item>

            <Form.Item style={{ marginTop: '3rem', marginBottom: 0 }}>
              <SaveButton type="primary" htmlType="submit" size="large" loading={isChangingPassword}>
                {t('profile.btn_change_password', 'Đổi mật khẩu')}
              </SaveButton>
            </Form.Item>
          </Form>
        </ProfileCard>
      </ProfileGrid>
    </ProfileWrapper>
  );
};

export default Profile;
