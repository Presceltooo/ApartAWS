import { createRoute } from '@tanstack/react-router';
import { portalRoute } from '../../Route';
import Concierge from './index';

export const conciergeRoute = createRoute({
  getParentRoute: () => portalRoute,
  path: '/concierge',
  component: Concierge,
});

export default conciergeRoute;
