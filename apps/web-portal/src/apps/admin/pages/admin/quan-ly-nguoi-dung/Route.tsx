import { createRoute } from '@tanstack/react-router';
import { adminRoute } from '../../../Route';
import SystemUsers from './index';

export const systemUsersRoute = createRoute({
  getParentRoute: () => adminRoute,
  path: '/quan-ly-nguoi-dung',
  component: SystemUsers,
});

export default systemUsersRoute;
