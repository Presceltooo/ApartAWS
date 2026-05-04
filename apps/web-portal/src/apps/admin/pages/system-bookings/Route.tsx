import { createRoute } from '@tanstack/react-router';
import { adminRoute } from '../../Route';
import SystemBookings from './index';

export const systemBookingsRoute = createRoute({
  getParentRoute: () => adminRoute,
  path: '/system-bookings',
  component: SystemBookings,
});

export default systemBookingsRoute;
