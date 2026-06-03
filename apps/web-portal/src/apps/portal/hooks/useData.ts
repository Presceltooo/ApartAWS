import { useApartmentListing } from '@apps/portal/services/query';
import type { IApartment } from '@apps/portal/services/types';

interface UseDataProps {
  location?: string;
  startDate?: string;
  endDate?: string;
  pageSize?: number;
}

export const useData = (params?: UseDataProps) => {
  const { data: response, isLoading, isError } = useApartmentListing({
    Location: params?.location || undefined,
    StartDate: params?.startDate || undefined,
    EndDate: params?.endDate || undefined,
    PageSize: params?.pageSize ?? 6,
  });

  const apartments: IApartment[] = response?.data ?? [];



  // Helper to generate a status based on active state and array index
  const getStatus = (isActive: boolean, index: number) => {
    if (!isActive) return 'verified';
    const statuses = ['available', 'rare', 'verified', 'new'];
    return statuses[index % statuses.length];
  };

  // Transform backend list to the shape required by TrangChu.tsx
  const residences = apartments.map((apt, idx) => ({
    id: apt.id,
    title: apt.title,
    price: apt.pricePerNight,
    rating: apt.averageRating ?? null,
    desc: apt.description || 'Không có mô tả cho căn hộ này.',
    status: getStatus(apt.isActive, idx),
    img: apt.images?.[0] || 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=900&q=80',
  }));

  return {
    residences,
    isLoading,
    isError,
  };
};
