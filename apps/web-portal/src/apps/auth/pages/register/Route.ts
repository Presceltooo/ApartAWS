import { createRoute } from '@tanstack/react-router';
import { authdRoute } from '@apps/auth/Route';
import Register from '@apps/auth/pages/register/Register';
import { REGISTER_ROUTE } from '@apps/auth/constants';

export const registerRoute = createRoute({
  getParentRoute: () => authdRoute,
  path: REGISTER_ROUTE,
  component: Register,
});

export default registerRoute;
