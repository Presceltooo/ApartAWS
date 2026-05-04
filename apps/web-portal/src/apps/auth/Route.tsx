import { rootRoute } from "@/Route";
import AuthUserLayout from "@apps/auth/components/AuthUserLayout";
import AuthAdminLayout from "@apps/auth/components/AuthAdminLayout";
import loginRoute from "@apps/auth/pages/login/Route";
import { createRoute } from "@tanstack/react-router";

import forgotPasswordRoute from "@apps/auth/pages/forgot-password/Route";
import resetPasswordRoute from "@apps/auth/pages/reset-password/Route";
import loginAdminRoute from "./pages/login-admin/Route";
import registerRoute from "./pages/register/Route";

// Layout dành cho User (sáng, luxury warm)
const USER_AUTH_LAYOUT = "_userAuthLayout";
export const authdRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: USER_AUTH_LAYOUT,
  component: AuthUserLayout,
});

// Layout dành cho Admin (tối, ảnh nền)
const ADMIN_AUTH_LAYOUT = "_adminAuthLayout";
export const adminAuthRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: ADMIN_AUTH_LAYOUT,
  component: AuthAdminLayout,
});

authdRoute.addChildren([loginRoute, forgotPasswordRoute, resetPasswordRoute, registerRoute]);
adminAuthRoute.addChildren([loginAdminRoute]);

export default authdRoute;
