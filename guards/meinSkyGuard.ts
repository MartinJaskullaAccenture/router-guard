import { store } from '../redux/store';
import { Guards } from './RouteGuard';

export const meinSkyGuard: Guards = {
    "/mein-sky": ({allowNavigation, routerPush}) => store.isLoggedIn
        ? allowNavigation()
        : routerPush("/login?redirectAfterLogin=mein-sky")
}
