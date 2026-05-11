import { createRoute } from '@tanstack/react-router';
import { adminAuthRoute } from '../../Route';
import RegisterAdmin from './RegisterAdmin';

const registerAdminRoute = createRoute({
  getParentRoute: () => adminAuthRoute,
  path: '/quan-ly/dang-ky',
  component: RegisterAdmin,
});

export default registerAdminRoute;
