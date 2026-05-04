import { createRoute } from '@tanstack/react-router';
import { authdRoute } from '../../Route';
import ResetPassword from './index';

export const resetPasswordRoute = createRoute({
  getParentRoute: () => authdRoute,
  path: '/dat-lai-mat-khau',
  component: ResetPassword,
});

export default resetPasswordRoute;
