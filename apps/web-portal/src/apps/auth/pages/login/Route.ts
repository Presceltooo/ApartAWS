import { LOCAL_STORAGE_KEYS } from '@constants/storageKeys';
import { lcStorage } from '@utils/storage';
import { authdRoute } from '@apps/auth/Route';
import { LOGIN_ROUTE } from '@apps/auth/constants';
import Login from '@apps/auth/pages/login/Login';
import { createRoute, redirect } from '@tanstack/react-router';

export const loginRoute = createRoute({
  getParentRoute: () => authdRoute,
  path: LOGIN_ROUTE,
  component: Login,
  beforeLoad: () => {
    const accessToken = lcStorage.get<string>(
      LOCAL_STORAGE_KEYS.accessToken
    );

    // Đã login thì không cho vào trang login
    if (accessToken) {
      throw redirect({
        to: '/',
      });
    }
  },
})

export default loginRoute;