import { createRoute } from '@tanstack/react-router';
import { adminRoute } from '../../Route';
import OwnerBookings from './index';

const ownerBookingsRoute = createRoute({
  getParentRoute: () => adminRoute,
  path: '/booking',
  component: OwnerBookings,
});

export default ownerBookingsRoute;
