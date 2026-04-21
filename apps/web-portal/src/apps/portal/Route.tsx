import { createRoute } from '@tanstack/react-router';
import { rootRoute } from "@/Route";
import PortalLayout from './layout/PortalLayout';
import dashboardRoute from './pages/dashboard/Route';
import bookingsRoute from './pages/bookings/Route';
import apartmentDetailsRoute from './pages/apartment-details/Route';

import TrangChu from './TrangChu';

export const portalRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: 'portal-layout',
  component: PortalLayout,
});

const homeRoute = createRoute({
  getParentRoute: () => portalRoute,
  path: '/',
  component: TrangChu,
});

portalRoute.addChildren([
  homeRoute,
  dashboardRoute,
  bookingsRoute,
  apartmentDetailsRoute,
]);

export default portalRoute;