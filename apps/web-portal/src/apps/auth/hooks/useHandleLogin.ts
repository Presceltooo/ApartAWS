import { App } from 'antd';
import { useRouter } from '@tanstack/react-router';
import tokenManager from '@utils/tokenManager';
import { useLogin } from '../services';
import type { TLoginPayload } from '../services';

/**
 * Hook tổng hợp xử lý đăng nhập User (Tenant / Owner).
 * Sử dụng trong trang Login.tsx
 */
export const useHandleLogin = () => {
  const { notification } = App.useApp();
  const router = useRouter();
  const { mutate: loginMutate, isPending } = useLogin();

  const handleLogin = (payload: TLoginPayload) => {
    loginMutate(payload, {
      onSuccess: (res: any) => {
        const data = res?.data ?? res;

        if (!data?.accessToken) {
          notification.error({
            message: 'Đăng nhập thất bại',
            description: res?.message || 'Thông tin đăng nhập không chính xác.',
          });
          return;
        }

        // Lưu token
        tokenManager.setAccessToken(data.accessToken);
        tokenManager.setRefreshToken(data.refreshToken);

        notification.success({
          message: 'Đăng nhập thành công',
          description: `Chào mừng trở lại, ${data.user?.fullName || data.user?.email || ''}!`,
        });

        // Điều hướng dựa trên role
        const role = data.user?.role;
        const currentPath = window.location.pathname;

        // Kiểm tra bảo mật cho trang đăng nhập Admin
        if (currentPath.startsWith('/quan-ly/dang-nhap') && role !== 'ADMIN') {
          notification.error({
            message: 'Quyền truy cập bị từ chối',
            description: 'Tài khoản này không có quyền truy cập vào khu vực quản trị hệ thống.',
          });
          tokenManager.removeAccessToken();
          tokenManager.removeRefreshToken();
          return;
        }

        if (role === 'ADMIN') {
          router.navigate({ to: '/quan-ly/tong-quan-he-thong' });
        } else if (role === 'OWNER') {
          router.navigate({ to: '/quan-ly/danh-sach-can-ho' });
        } else {
          router.navigate({ to: '/' });
        }
      },
      onError: (err: any) => {
        notification.error({
          message: 'Đăng nhập thất bại',
          description: err?.data?.message || err?.message || 'Đã có lỗi xảy ra.',
        });
      },
    });
  };

  return { handleLogin, isPending };
};
