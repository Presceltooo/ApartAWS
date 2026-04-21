import { createRoute } from '@tanstack/react-router';
import { portalRoute } from '../../Route';
import Dashboard from './index';

const dashboardRoute = createRoute({
  getParentRoute: () => portalRoute,
  path: '/portal',
  component: Dashboard,
});

export default dashboardRoute;
