import { useEffect } from 'react';
import { NextRouter, useRouter } from "next/router";
import { meinSkyGuard } from './meinSkyGuard';
import { salesGuard } from './salesGuard';
import { wildcardToRegExp } from './wildcard-to-reg-exp';


interface GuardParams {
    url: string,
    allowNavigation: () => void,
    routerPush: (...args: Parameters<NextRouter["push"]>) => never,
    windowOpen: (...args: Parameters<typeof window["open"]>) => never
}

export type Guards = {
    [url: string]: (guardParams: GuardParams) => undefined
}

const guards: Guards = {
    ...meinSkyGuard,
    ...salesGuard,
    // "/mein-sky/*": ({noNavigation}) => noNavigation(),
    "/mein-sky/*/*": ({routerPush}) => routerPush("/")
}


export function useRouteGuards() {
    const router = useRouter()

    // When a user enters a url in the browser bar manually, there is no way to prevent them from getting
    // the html file and displaying the page (Preventing that is only be possible with SSR).
    // This effect redirects the user away if they are on a wrong page. The wrong page will be visible for a short time (flickering).
    useEffect(() => {
        try {
            checkGuards(router.pathname, guards, router)
        } catch (_) {
            // throw "string" is currently the only way to cancel NextJS navigations:
            // https://github.com/vercel/next.js/discussions/12348
            // If we are already on a page, we need to catch this error.
        }
    }, [router.pathname])

    // This effects changes the navigation destination before it happens.
    // The wrong page will not be loaded over the network and will not be displayed (no flickering).
    useEffect(() => {
        const callback = (url: string) => checkGuards(url, guards, router)
        router.events.on('routeChangeStart', callback);
        return () => router.events.off('routeChangeStart', callback)
    })
}

function checkGuards(url: string, guards: Guards, router: NextRouter) {
    const guard = getGuard(url, guards)

    if (guard) {
        guard({
            url,
            allowNavigation: () => undefined,
            routerPush: (...args: Parameters<NextRouter["push"]>) => {
                router.push(...args)
                throw `Navigation changed from ${url} to ${args[0]} (This is not an error).`;
            },
            windowOpen: (...args: Parameters<typeof window["open"]>) => {
                window.open(...args)
                throw `Navigation changed from ${url} to ${args[0]} (This is not an error).`;
            }
        })
    }
}

// /mein-sky/*/order matches /mein-sky//order
// /mein-sky/*/order matches /mein-sky/user/order
// /mein-sky/*/order does not match /mein-sky/user/
// /mein-sky/*/order does not match /mein-sky/order (only one /)
// /mein-sky/* does not match /mein-sky
// /mein-sky/* matches /mein-sky/
// /mein-sky/* matches /mein-sky/user
// /mein-sky/* matches /mein-sky/user/order
// /mein-sky/*/* matches /mein-sky/user/order, but not /mein-sky/user
export function getGuard(url: string, guards: Guards): Guards[keyof Guards] | undefined {
    if (url in guards) return guards[url]

    const wildcardUrls = Object.keys(guards).filter(url => url.includes("*"))
    const matchingWildcardUrl = wildcardUrls.find(wildcardUrl => !!url.match(wildcardToRegExp(wildcardUrl)))
    if (matchingWildcardUrl) return guards[matchingWildcardUrl]
}

