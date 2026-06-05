import axiosClient from '@/configs/axios';

const BASE_URL = 'notifications';

export const layTatCaThongBao = async ({ page = 1, pageSize = 20, ...restParams } = {}) => {
  const res = await axiosClient.get(`${BASE_URL}/my-notifications`, {
    params: { page, pageSize, ...restParams },
  });
  return res as any;
};

export const danhDauDaXem = async (id: number) => {
  await axiosClient.put(`${BASE_URL}/${id}/read`);
};

export const danhDauTatCaDaXem = async () => {
  await axiosClient.put(`${BASE_URL}/read-all`);
};

export const xoaThongBao = async (ids: number[]) => {
  return axiosClient.delete(`${BASE_URL}/delete-many`, {
    data: { ids },
  });
};

export const demSoLuongThongBaoChuaXem = async (): Promise<number> => {
  const res = await axiosClient.get(`${BASE_URL}/unread-count`);
  return (res as any).data;
};
