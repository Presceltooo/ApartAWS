import { createRoute } from '@tanstack/react-router';
import { adminRoute } from '../../../Route';
import OwnerDashboard from './index';

const ownerDashboardRoute = createRoute({
  getParentRoute: () => adminRoute,
  path: '/tong-quan',
  component: OwnerDashboard,
});

export default ownerDashboardRoute;
