/**
 * Form data & Payload gửi lên API BE
 */
export type TLoginPayload = {
  email: string;
  password: string;
};

export type TRegisterPayload = {
  email: string;
  password: string;
  fullName: string;
  phone: string;
  address: string;
  role: 'ADMIN' | 'OWNER' | 'TENANT';
};

export type TRefreshTokenPayload = {
  refreshToken: string;
};

export type TChangePasswordPayload = {
  oldPassword: string;
  newPassword: string;
};

/**
 * Response từ API Backend
 */
export interface IUser {
  userId: string;
  email: string;
  fullName: string;
  phone: string;
  address: string;
  role: string;
}

export interface IAuthResponse {
  accessToken: string;
  refreshToken: string;
}

export interface ILoginRespone extends IAuthResponse {
  accessExpiresAt?: string;
  refreshExpiresAt?: string;
  roles?: string[];
  metaData?: any;
  user?: IUser;
}
