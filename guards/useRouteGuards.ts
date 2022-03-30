import { useEffect } from 'react';
import { NextRouter, useRouter } from "next/router";
import { meinSkyGuard } from './meinSkyGuard';
import { salesGuard } from './salesGuard';

export type Guards = {
    [url: string]: () => { newUrl: string, absoluteUrl?: boolean, newTab?: boolean }
}

// TODO Export registerGuards
const guards: Guards = {
    ...meinSkyGuard,
    ...salesGuard
}
export function useRouteGuards() {
    const router = useRouter()


    useEffect(() => {
        try {
            checkGuards(router.pathname, guards, router)
        } catch (_) {
            // throw "string" is currently the only way to cancel NextJS navigations:
            // https://github.com/vercel/next.js/discussions/12348
            // If we are already on a page, we need to catch this error.
        }
    }, [router.pathname])

    useEffect(() => {
        const callback = (url: string) => checkGuards(url, guards, router)
        router.events.on('routeChangeStart', callback);
        return () => router.events.off('routeChangeStart', callback)
    })
}

function checkGuards(url: string, guards: Guards, router: NextRouter) {
    if (url in guards) {
        const {newUrl, absoluteUrl, newTab} = guards[url]()
        // Allow navigation
        if (newUrl === url) return
        // No navigation
        if (!newUrl) throw 'Navigation cancelled (This is not an error).';
        // Different navigation
        if (absoluteUrl) {
            window.open(newUrl, newTab ? "_blank" : "_self", "noopener");
        } else {
            router.push(newUrl)
        }
        throw `Navigation changed from ${url} to ${newUrl} (This is not an error).`;
    }
}
