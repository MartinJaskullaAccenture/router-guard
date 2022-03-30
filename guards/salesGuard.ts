import { Guards } from '../guards/useRouteGuards';
import { store } from '../redux/store';

export const salesGuard: Guards = {
    "/sales": ({allowNavigation, routerPush}) => store.isActive
        ? routerPush("/upsell")
        : allowNavigation()
}
