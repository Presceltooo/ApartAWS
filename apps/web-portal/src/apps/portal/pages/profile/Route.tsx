import { createRoute } from '@tanstack/react-router';
import { portalRoute } from '../../Route';
import Profile from './index';

export const profileRoute = createRoute({
  getParentRoute: () => portalRoute,
  path: '/profile',
  component: Profile,
});

export default profileRoute;
