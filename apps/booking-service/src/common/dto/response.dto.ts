import { PaginationMetaDTO } from './pagination-meta.dto';

export class ApiResponse<T> {
  code: number;
  success: boolean;
  message: string;
  data: T;
  metaData?: PaginationMetaDTO;

  constructor(data: T, message = 'Success', code = 0, meta?: PaginationMetaDTO) {
    this.code = code;
    this.success = code === 0;
    this.message = message;
    this.data = data;
    this.metaData = meta;
  }
}
