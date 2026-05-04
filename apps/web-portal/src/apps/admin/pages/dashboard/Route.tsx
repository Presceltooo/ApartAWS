import { createRoute } from '@tanstack/react-router';
import { adminRoute } from '../../Route';
import AdminDashboard from './index';

export const dashboardRoute = createRoute({
  getParentRoute: () => adminRoute,
  path: '/dashboard',
  component: AdminDashboard,
});

export default dashboardRoute;
