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
          description: `Chào mừng trở lại!`,
        });

        // Điều hướng về trang chủ user
        router.navigate({ to: '/' });
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
