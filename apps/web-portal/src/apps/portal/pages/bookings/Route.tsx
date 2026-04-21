import { createRoute } from '@tanstack/react-router';
import { portalRoute } from '../../Route';
import Bookings from './index';

const bookingsRoute = createRoute({
  getParentRoute: () => portalRoute,
  path: '/bookings',
  component: Bookings,
});

export default bookingsRoute;
