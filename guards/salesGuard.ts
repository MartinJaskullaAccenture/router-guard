import { Guards } from '../guards/useRouteGuards';
import { store } from '../redux/store';

export const salesGuard: Guards = {
    "/sales": () => store.isActive
        ? {newUrl: "/upsell"}
        : {newUrl: "/sales"}
        // : {newUrl: "https://google.com", absoluteUrl: true, newTab: true}
}
