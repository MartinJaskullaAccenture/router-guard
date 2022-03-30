import { Guards } from '../guards/useRouteGuards';
import { store } from '../redux/store';

export const meinSkyGuard: Guards = {
  "/mein-sky": () => store.isLoggedIn ? "/mein-sky" : "/login?redirectAfterLogin=mein-sky"
}
