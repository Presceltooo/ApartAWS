export interface Notification {
  id: number;
  tieuDe: string;
  noiDung: string;
  daXem: boolean;
  loai: string;
  ngayTao: string;
  nghiepVu?: string;
  idDoiTuongLienQuan?: string | null;
  urlDieuHuong?: string;
  nguoiNhanType?: string;
}

export interface MetaData {
  page: number;
  pageSize: number;
  total: number;
  totalPage: number;
}

export interface NotificationResponse {
  data: Notification[];
  metaData: MetaData;
}
