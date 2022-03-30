import { Guards } from '../guards/useRouteGuards';
import { store } from '../redux/store';

export const googleGuard: Guards = {
    "https://google.com/": () => false
        ? {newUrl: "https://google.com/", absoluteUrl: true}
        : {newUrl: "/index"}
}
