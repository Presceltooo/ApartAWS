import { createRoute } from '@tanstack/react-router';
import { portalRoute } from '../../Route';
import ApartmentDetails from './index';

const apartmentDetailsRoute = createRoute({
  getParentRoute: () => portalRoute,
  path: '/apartment/$id',
  component: ApartmentDetails,
});

export default apartmentDetailsRoute;
