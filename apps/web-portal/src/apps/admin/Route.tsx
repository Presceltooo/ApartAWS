import { createRoute, redirect } from '@tanstack/react-router';
import { rootRoute } from '../../Route';
import AdminLayout from './layout/AdminLayout';
import tokenManager from '@utils/tokenManager';
import { ADMIN_LOGIN_ROUTE } from '@apps/auth/constants';
import myApartmentsRoute from './pages/owner/danh-sach-can-ho/Route';
import { apartmentFormCreateRoute, apartmentFormEditRoute } from './pages/shared/bieu-mau-can-ho/Route';
import ownerBookingsRoute from './pages/owner/quan-ly-dat-phong/Route';
import dashboardRoute from './pages/admin/tong-quan-he-thong/Route';
import systemUsersRoute from './pages/admin/quan-ly-nguoi-dung/Route';
import systemApartmentsRoute from './pages/admin/quan-ly-tat-ca-can-ho/Route';
import systemBookingsRoute from './pages/admin/quan-ly-tat-ca-dat-phong/Route';

export const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/quan-ly',
  component: AdminLayout,
  beforeLoad: () => {
    const token = tokenManager.getAccessToken();
    const role = tokenManager.getUserRole();

    if (!token || (role !== 'ADMIN' && role !== 'OWNER')) {
      throw redirect({ to: ADMIN_LOGIN_ROUTE });
    }
  },
});

adminRoute.addChildren([
  myApartmentsRoute,
  apartmentFormCreateRoute,
  apartmentFormEditRoute,
  ownerBookingsRoute,
  dashboardRoute,
  systemUsersRoute,
  systemApartmentsRoute,
  systemBookingsRoute,
]);

export default adminRoute;
