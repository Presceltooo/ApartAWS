import { createRoute } from '@tanstack/react-router';
import { portalRoute } from '../../Route';
import BookingDetail from './BookingDetail';

const bookingDetailRoute = createRoute({
  getParentRoute: () => portalRoute,
  path: '/bookings/$id',
  component: BookingDetail,
});

export default bookingDetailRoute;
