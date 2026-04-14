import type { ReactNode } from 'react';
import type { UseQueryOptions } from '@tanstack/react-query';

export interface IQueryParams<TParams = any, TOptions = UseQueryOptions<any, any, any>> {
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