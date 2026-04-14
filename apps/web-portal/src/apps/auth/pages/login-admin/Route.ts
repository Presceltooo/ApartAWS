import { adminAuthRoute } from "@apps/auth/Route";
import { ADMIN_LOGIN_ROUTE } from "@apps/auth/constants";
import { createRoute } from "@tanstack/react-router";
import LoginAdmin from "./LoginAdmin";

export const loginAdminRoute = createRoute({
  getParentRoute: () => adminAuthRoute,
  path: ADMIN_LOGIN_ROUTE,
  component: LoginAdmin,
});

export default loginAdminRoute;
