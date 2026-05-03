import { createRoute } from '@tanstack/react-router';
import { rootRoute } from '../../Route';
import AdminLayout from './layout/AdminLayout';
import myApartmentsRoute from './pages/my-apartments/Route';
import { apartmentFormCreateRoute, apartmentFormEditRoute } from './pages/apartment-form/Route';
import ownerBookingsRoute from './pages/owner-bookings/Route';

export const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/quan-ly',
  component: AdminLayout,
  beforeLoad: () => {
    // Basic auth/role check placeholder
    // In a real app, you would check the token role here
    // const token = localStorage.getItem('access_token');
    // For now, if no token, maybe redirect to login (auth module handles login, maybe /auth/login)
    // if (!token) {
    //   throw redirect({ to: '/' });
    // }
  },
});

adminRoute.addChildren([
  myApartmentsRoute,
  apartmentFormCreateRoute,
  apartmentFormEditRoute,
  ownerBookingsRoute,
]);

export default adminRoute;
