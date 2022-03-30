import { useEffect } from 'react';
import { meinSkyGuard } from './meinSkyGuard';
import { salesGuard } from './salesGuard';
import { useRouter } from "next/router";

export type Guards = {
    [url: string]: () => string
}

const guards: Guards = {
    ...meinSkyGuard,
    ...salesGuard
}

export function useRouteGuards() {
    const router = useRouter()

    useEffect(() => {
        router.events.on('routeChangeStart', url => {
            if(url in guards) {
                const redirectionUrl = guards[url]()
                // Allow navigation
                if(url === redirectionUrl) return
                // No navigation
                if(!redirectionUrl) throw 'Abort route change. Please ignore this error.';
                // Different navigation
                router.replace(redirectionUrl)
            }
        });
    })
}
