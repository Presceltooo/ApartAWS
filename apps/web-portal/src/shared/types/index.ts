import type { UseQueryOptions } from "@tanstack/react-query";
import type { ReactNode } from 'react';

type TQueryOverrides = Omit<
  UseQueryOptions<any, any, any, readonly unknown[]>,
  "queryKey" | "queryFn"
>;

export interface IQueryParams<TParams = any, TOptions = TQueryOverrides> {
  options?: TOptions;
  params?: TParams;
}

export interface IReactChildren {
  children: ReactNode;
}

export interface IIconProps {
  size?: number | number;
  color?: string;
  style?: object;
}

export interface IBaseFilter {
  page?: number;
  pageSize?: number;
  sortBy?: string;
  orderBy?: 1 | -1;
}

export type TFilter = { Query?: object; Keyword?: string } & IBaseFilter
