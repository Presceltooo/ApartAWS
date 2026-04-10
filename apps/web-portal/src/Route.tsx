import {
  Outlet,
  createRootRoute,
  createRouter,
} from '@tanstack/react-router'
// import NotFound404 from '@shared/components/404'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
//route
// import dashboardRoute from '@apps/dashboard/Route';
import authdRoute, { adminAuthRoute } from '@apps/auth/Route';
// import userRoute from '@apps/user/Route';
//constant
// import { LOGIN_ROUTE } from '@/constants';
// import tokenManager from '@utils/tokenManager';

export const rootRoute = createRootRoute({
  component: RootComponent,
  // notFoundComponent: NotFound404,
  // Hook chạy trước khi load bất kỳ route con nào
  beforeLoad: async () => {
    // Tạm comment để vào được view Auth
    /*
    const accessToken = tokenManager.getAccessToken();
    const loggedIn = !!accessToken
    // Nếu chưa đăng nhập và không đang ở trang login
    if (!loggedIn && !location.pathname.startsWith(LOGIN_ROUTE)) {
      throw redirect({
        to: LOGIN_ROUTE,
        search: {
          redirect: location.href, // lưu lại URL gốc để quay lại sau
        },
      })
    }
    */
  },
})

function RootComponent() {
  return (
    <>
      <Outlet />
      <TanStackRouterDevtools position="bottom-right" />
    </>
  )
}

export const routeTree = rootRoute.addChildren([
  // dashboardRoute,
  authdRoute,
  adminAuthRoute,
  // userRoute
])

// Set up a Router instance
const router = createRouter({
  routeTree,
  defaultPreload: 'intent',
  defaultStaleTime: 5000,
  scrollRestoration: true,
})

export default router;