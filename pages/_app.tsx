import type { AppProps } from 'next/app'
import { RouteGuard } from '../guards/RouteGuard';

function MyApp({Component, pageProps}: AppProps) {
    return <RouteGuard>
        <Component {...pageProps} />
    </RouteGuard>
}

export default MyApp
