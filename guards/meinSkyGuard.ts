import { Guards } from '../guards/useRouteGuards';
import { store } from '../redux/store';

export const meinSkyGuard: Guards = {
    "/mein-sky": () => store.isLoggedIn
        ? {newUrl: "/mein-sky"}
        : {newUrl: "/login?redirectAfterLogin=mein-sky"}
}
