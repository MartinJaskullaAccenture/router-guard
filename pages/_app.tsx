import type { AppProps } from 'next/app'
import { useRouteGuards } from '../guards/useRouteGuards';

function MyApp({Component, pageProps}: AppProps) {
    useRouteGuards()
    return <Component {...pageProps} />
}

export default MyApp
