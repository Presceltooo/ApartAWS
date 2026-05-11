import { createRoute } from '@tanstack/react-router';
import { adminAuthRoute } from '../../Route';
import LoginAdmin from './LoginAdmin';

const loginAdminRoute = createRoute({
  getParentRoute: () => adminAuthRoute,
  path: '/quan-ly/dang-nhap',
  component: LoginAdmin,
});

export default loginAdminRoute;
