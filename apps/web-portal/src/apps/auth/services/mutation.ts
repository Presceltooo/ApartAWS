import { useMutation } from "@tanstack/react-query";
import { login, register, refreshTokens, logout, changePassword } from "./api";

/**
 * Hook sử dụng API đăng nhập
 */
export const useLogin = () => {
  return useMutation({ mutationFn: login });
};

/**
 * Hook sử dụng API đăng ký
 */
export const useRegister = () => {
  return useMutation({ mutationFn: register });
};

/**
 * Hook sử dụng API làm mới token
 */
export const useRefreshTokens = () => {
  return useMutation({ mutationFn: refreshTokens });
};

/**
 * Hook sử dụng API đăng xuất
 */
export const useLogout = () => {
  return useMutation({ mutationFn: logout });
};

/**
 * Hook sử dụng API đổi mật khẩu
 */
export const useChangePassword = () => {
  return useMutation({ mutationFn: changePassword });
};
