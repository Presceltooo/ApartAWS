import { createRoute } from '@tanstack/react-router'
import { authdRoute } from '@apps/auth/Route';
import ForgotPassword from '@apps/auth/pages/forgot-password/ForgotPassword';

import { FORGOT_PASSWORD_ROUTE } from '@apps/auth/constants'

export const forgotPasswordRoute = createRoute({
  getParentRoute: () => authdRoute,
  path: FORGOT_PASSWORD_ROUTE,
  component: ForgotPassword,
})

export default forgotPasswordRoute;