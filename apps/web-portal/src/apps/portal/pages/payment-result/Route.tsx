import { createRoute } from '@tanstack/react-router';
import { portalRoute } from '@apps/portal/Route';
import KetQuaThanhToan from './KetQuaThanhToan';

const paymentResultRoute = createRoute({
  getParentRoute: () => portalRoute,
  path: '/booking/ket-qua-thanh-toan',
  component: KetQuaThanhToan,
  validateSearch: (search: Record<string, unknown>) => ({
    status: search.status as string | undefined,
    txnRef: search.txnRef as string | undefined,
    amount: search.amount as string | undefined,
    transactionId: search.transactionId as string | undefined,
    code: search.code as string | undefined,
    message: search.message as string | undefined,
  }),
});

export default paymentResultRoute;
