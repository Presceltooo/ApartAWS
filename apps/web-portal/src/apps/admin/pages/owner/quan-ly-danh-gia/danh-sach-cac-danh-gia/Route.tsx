import { createRoute } from '@tanstack/react-router';
import { adminRoute } from '../../../../Route';
import OwnerReviewsDetail from './index';

export const ownerReviewsDetailRoute = createRoute({
  getParentRoute: () => adminRoute,
  path: '/quan-ly-danh-gia/danh-sach-cac-danh-gia',
  component: OwnerReviewsDetail,
  validateSearch: (search: Record<string, unknown>) => ({
    apartmentId: search.apartmentId as string,
  }),
});

export default ownerReviewsDetailRoute;
