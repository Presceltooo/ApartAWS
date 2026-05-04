import { useApartmentListing } from '@apps/portal/services/query';
import type { IApartment } from '@apps/portal/services/types';

interface UseDataProps {
  keyword: string;
  location?: string;
  minPrice?: number;
  maxPrice?: number;
  page: number;
  pageSize: number;
}

export const useData = ({ keyword, location, minPrice, maxPrice, page, pageSize }: UseDataProps) => {
  const { data: response, isLoading, isError } = useApartmentListing({
    Keyword: keyword || undefined,
    Location: location || undefined,
    MinPrice: minPrice,
    MaxPrice: maxPrice,
    Page: page,
    PageSize: pageSize,
  });

  const apartments: IApartment[] = response?.data ?? [];
  const total: number = response?.metaData?.total ?? 0;

  return {
    apartments,
    total,
    isLoading,
    isError,
  };
};
