import axios  from 'axios';
import { App } from 'antd';
import type { AxiosRequestConfig, AxiosError, AxiosResponse } from 'axios'
import type { IResponse } from '@shared/types/response.type';
import tokenManager from '@utils/tokenManager';
import { handleRefreshToken } from '@utils/refreshToken';

export interface IOriginRequest extends AxiosRequestConfig { _retry: boolean; }

const handleRequest = (config: AxiosRequestConfig): AxiosRequestConfig => {
  //check token
  const accessToken = tokenManager.getAccessToken();
  if (accessToken && config.headers) {
    config.headers['Authorization'] = 'Bearer ' + accessToken;
  }
  config.validateStatus = function (status) {
    return (status >= 200 && status < 300) || status === 404; // default
  };
  return config;
};

const handleRequestError = (error: AxiosError): Promise<AxiosError> => {
  return Promise.reject(error);
};

const handleResponse = (response: AxiosResponse) => {
  //Trả thẳng về data trong trường hợp là phương thức là GET
  if (response.config.method === 'get') return response.data.data;

  return response.data;
};

const handleResponseError = async (error: AxiosError<IResponse<any>>) => {
  const { notification } = App.useApp();
  console.log('Request error: ', { error });

  const originalRequest = error.config as IOriginRequest;

  //handle refresh token
  if (error.response?.status === 401 && !originalRequest._retry) {
    return handleRefreshToken(originalRequest);
  }

  //internal server error
  if (error.response?.status === 500) {
    notification.error({
      message: 'Thất bại!',
      description: 'Đã có lỗi xảy ra',
    });
    return Promise.reject(error.response);
  }

  //show message error
  if (error.response?.status !== 404 && error.response?.status !== 403) {
    notification.error({
      message: 'Thất bại!',
      description: error.response?.data?.message || error.message,
    });
  }

  return Promise.reject(error.response);
};

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosClient.interceptors.request.use(handleRequest as any, handleRequestError);
axiosClient.interceptors.response.use(handleResponse, handleResponseError);

export default axiosClient;