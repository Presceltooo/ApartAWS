import { createRoute } from '@tanstack/react-router';
import { adminRoute } from '../../Route';
import ApartmentForm from './index';

export const apartmentFormCreateRoute = createRoute({
  getParentRoute: () => adminRoute,
  path: '/can-ho/tao-moi',
  component: ApartmentForm,
});

export const apartmentFormEditRoute = createRoute({
  getParentRoute: () => adminRoute,
  path: '/can-ho/sua/$id',
  component: ApartmentForm,
});
