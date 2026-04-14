import { PaginationMetaDTO } from '../dto/pagination-meta.dto';

export interface PaginatedResult<T> {
  data: T[];
  metaData: PaginationMetaDTO;
}

export type PaginationOptions = {
  page?: number | string;
  pageSize?: number | string;
};

export async function paginate<T>(
  model: any,
  options: PaginationOptions = { page: 1, pageSize: 10 },
  args: any = {},
): Promise<PaginatedResult<T>> {
  const page = Math.max(Number(options.page) || 1, 1);
  const pageSize = Math.max(Number(options.pageSize) || 10, 1);
  const skip = (page - 1) * pageSize;

  const [data, total] = await Promise.all([
    model.findMany({ ...args, skip, take: pageSize }),
    model.count({ where: args.where }),
  ]);

  return {
    data,
    metaData: new PaginationMetaDTO(page, pageSize, total),
  };
}
