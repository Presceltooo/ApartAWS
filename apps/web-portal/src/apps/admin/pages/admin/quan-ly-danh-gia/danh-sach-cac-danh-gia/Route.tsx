import { createRoute } from '@tanstack/react-router';
import { adminRoute } from '../../../../Route';
import SystemReviewsDetail from './index';

export const systemReviewsDetailRoute = createRoute({
  getParentRoute: () => adminRoute,
  path: '/quan-ly-tat-ca-danh-gia/danh-sach-cac-danh-gia',
  component: SystemReviewsDetail,
  validateSearch: (search: Record<string, unknown>) => ({
    apartmentId: search.apartmentId as string,
  }),
});

export default systemReviewsDetailRoute;
