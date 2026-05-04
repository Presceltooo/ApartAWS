import axiosClient from "@/configs/axios";
import type { IResponse } from "@/shared/types/response.type";
import type {
  TLoginPayload,
  TRegisterPayload,
  TRefreshTokenPayload,
  TChangePasswordPayload,
  TUpdateProfilePayload,
  ILoginRespone,
  IUser,
} from "./types";

/**
 * Tích hợp theo Interface của backend apartment-service/src/modules/auth
 */

export const login = (
  payload: TLoginPayload,
): Promise<IResponse<ILoginRespone>> => {
  return axiosClient.post("Auth/login", payload);
};

export const register = (
  payload: TRegisterPayload,
): Promise<IResponse<any>> => {
  return axiosClient.post("Auth/register", payload);
};

export const refreshTokens = (
  payload: TRefreshTokenPayload,
): Promise<IResponse<ILoginRespone>> => {
  return axiosClient.post("Auth/refresh", payload); 
};

export const logout = (
  payload: TRefreshTokenPayload,
): Promise<IResponse<any>> => {
  return axiosClient.post("Auth/logout", payload); 
};

export const getMe = (): Promise<IResponse<IUser>> => {
  return axiosClient.get("Auth/me");
};

export const changePassword = (
  payload: TChangePasswordPayload,
): Promise<IResponse<any>> => {
  return axiosClient.patch("Auth/change-password", payload);
};

export const updateProfile = (
  payload: TUpdateProfilePayload,
): Promise<IResponse<any>> => {
  return axiosClient.patch("Auth/profile", payload);
};

export const forgotPassword = (
  payload: { email: string },
): Promise<IResponse<any>> => {
  return axiosClient.post("Auth/forgot-password", payload);
};

export const resetPassword = (
  payload: any,
): Promise<IResponse<any>> => {
  return axiosClient.post("Auth/reset-password", payload);
};
