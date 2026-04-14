export interface IPagination<T> {
  pageIndex: number;
  pageSize: number;
  records: T[];
  totalPages: number;
  totalRecords: number;
}

export interface IResponse<T> {
  code: string;
  data: T;
  message: string;
}

export interface IResponse<T> {
  success: boolean;
  data: T;
  message: string;
  error :any;
}

export interface IResponsePagination<T> extends IResponse<IPagination<T>> {}
