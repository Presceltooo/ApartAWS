import { useApartmentListing } from '@apps/portal/services/query';
import type { IApartment } from '@apps/portal/services/types';

interface UseDataProps {
  keyword: string;
  page: number;
  pageSize: number;
}

export const useData = ({ keyword, page, pageSize }: UseDataProps) => {
  const { data: response, isLoading, isError } = useApartmentListing({
    Keyword: keyword || undefined,
    Page: page,
    PageSize: pageSize,
  });

  const apartments: IApartment[] = response?.data?.records ?? [];
  const total: number = response?.data?.totalRecords ?? 0;

  return {
    apartments,
    total,
    isLoading,
    isError,
  };
};
