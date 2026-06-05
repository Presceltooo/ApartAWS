import { createRoute } from '@tanstack/react-router';
import { portalRoute } from '../../Route';
import About from './index.tsx';

export const aboutRoute = createRoute({
  getParentRoute: () => portalRoute,
  path: '/about',
  component: About,
});

export default aboutRoute;
