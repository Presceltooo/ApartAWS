import { createRoute } from '@tanstack/react-router';
import { portalRoute } from '../../Route';
import ApartmentList from './index';

const apartmentListRoute = createRoute({
  getParentRoute: () => portalRoute,
  path: '/can-ho',
  component: ApartmentList,
});

export default apartmentListRoute;
