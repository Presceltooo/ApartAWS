import { createRoute } from '@tanstack/react-router';
import { adminRoute } from '../../../Route';
import SystemBookings from './index';

export const systemBookingsRoute = createRoute({
  getParentRoute: () => adminRoute,
  path: '/quan-ly-tat-ca-dat-phong',
  component: SystemBookings,
});

export default systemBookingsRoute;
