import { createRoute } from '@tanstack/react-router';
import { adminRoute } from '../../../Route';
import SystemReviews from './index';

export const systemReviewsRoute = createRoute({
  getParentRoute: () => adminRoute,
  path: '/quan-ly-tat-ca-danh-gia',
  component: SystemReviews,
});

export default systemReviewsRoute;
