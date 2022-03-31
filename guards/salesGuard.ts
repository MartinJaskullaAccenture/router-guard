import { store } from '../redux/store';
import { Guards } from './RouteGuard';

export const salesGuard: Guards = {
    "/sales": ({allowNavigation, routerPush}) => store.isActive
        ? routerPush("/upsell")
        : allowNavigation()
}
