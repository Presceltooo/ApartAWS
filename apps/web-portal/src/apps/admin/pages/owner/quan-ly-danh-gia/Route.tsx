import { createRoute } from '@tanstack/react-router';
import { adminRoute } from '../../../Route';
import OwnerReviews from './index';

export const ownerReviewsRoute = createRoute({
  getParentRoute: () => adminRoute,
  path: '/quan-ly-danh-gia',
  component: OwnerReviews,
});

export default ownerReviewsRoute;
