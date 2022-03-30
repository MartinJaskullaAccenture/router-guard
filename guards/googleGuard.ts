import { Guards } from '../guards/useRouteGuards';
import { store } from '../redux/store';

export const googleGuard: Guards = {
    "https://google.com/": () => store.isLoggedIn ? "https://google.com/" : "/index"
}
