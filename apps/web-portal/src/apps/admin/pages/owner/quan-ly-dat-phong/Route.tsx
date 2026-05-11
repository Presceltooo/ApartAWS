import { createRoute } from '@tanstack/react-router';
import { adminRoute } from '../../../Route';
import OwnerBookings from './index';

const ownerBookingsRoute = createRoute({
  getParentRoute: () => adminRoute,
  path: '/quan-ly-dat-phong',
  component: OwnerBookings,
});

export default ownerBookingsRoute;
