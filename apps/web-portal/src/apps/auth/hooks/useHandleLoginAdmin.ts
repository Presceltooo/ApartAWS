import { App } from 'antd';
import { useRouter } from '@tanstack/react-router';
import tokenManager from '@utils/tokenManager';
import { useLogin } from '../services';
import type { TLoginPayload } from '../services';

/**
 * Hook tổng hợp xử lý đăng nhập Admin.
 * Sử dụng trong trang LoginAdmin.tsx
 */
export const useHandleLoginAdmin = () => {
  const { notification } = App.useApp();
  const router = useRouter();
  const { mutate: loginMutate, isPending } = useLogin();

  const handleLoginAdmin = (payload: TLoginPayload) => {
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

        // Kiểm tra quyền admin (nếu BE trả về roles)
        const roles: string[] = data?.roles ?? data?.user?.role ? [data.user.role] : [];
        const isAdmin = roles.some((r) =>
          ['ADMIN', 'admin', 'Admin'].includes(r)
        );

        if (!isAdmin && roles.length > 0) {
          notification.error({
            message: 'Không có quyền truy cập',
            description: 'Tài khoản này không có quyền đăng nhập quản trị.',
          });
          return;
        }

        // Lưu token
        tokenManager.setAccessToken(data.accessToken);
        tokenManager.setRefreshToken(data.refreshToken);

        notification.success({
          message: 'Đăng nhập thành công',
          description: 'Chào mừng Quản trị viên!',
        });

        // Điều hướng về dashboard admin
        router.navigate({ to: '/admin' });
      },
      onError: (err: any) => {
        notification.error({
          message: 'Đăng nhập thất bại',
          description: err?.data?.message || err?.message || 'Đã có lỗi xảy ra.',
        });
      },
    });
  };

  return { handleLoginAdmin, isPending };
};
