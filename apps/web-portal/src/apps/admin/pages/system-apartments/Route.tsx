import { createRoute } from '@tanstack/react-router';
import { adminRoute } from '../../Route';
import SystemApartments from './index';

export const systemApartmentsRoute = createRoute({
  getParentRoute: () => adminRoute,
  path: '/system-apartments',
  component: SystemApartments,
});

export default systemApartmentsRoute;
