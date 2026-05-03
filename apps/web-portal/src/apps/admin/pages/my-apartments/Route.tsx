import { createRoute } from '@tanstack/react-router';
import { adminRoute } from '../../Route';
import MyApartments from './index';

const myApartmentsRoute = createRoute({
  getParentRoute: () => adminRoute,
  path: '/can-ho',
  component: MyApartments,
});

export default myApartmentsRoute;
