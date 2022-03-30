import { Guards } from '../guards/useRouteGuards';
import { store } from '../redux/store';

export const salesGuard: Guards = {
  "/sales": () => store.isActive ? "/upsell" : "/sales"
}
