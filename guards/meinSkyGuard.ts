import { Guards } from '../guards/useRouteGuards';
import { store } from '../redux/store';

export const meinSkyGuard: Guards = {
    "/mein-sky": ({allowNavigation, routerPush}) => store.isLoggedIn
        ? allowNavigation()
        : routerPush("/login?redirectAfterLogin=mein-sky")
}
