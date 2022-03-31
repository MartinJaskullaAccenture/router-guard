import { NextRouter, useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { meinSkyGuard } from './meinSkyGuard';
import { salesGuard } from './salesGuard';

// TODO Maybe overkill. Instead try export function pageReady(){getElementById("routeGuard").getAttribute("hidden")} // Maybe timing works out
let resolveFirstPageAllowed: () => void
export const firstPageAllowed = new Promise<void>((resolve, reject) => resolveFirstPageAllowed = resolve)

interface GuardParams {
    url: string,
    allowNavigation: () => void,
    routerPush: (...args: Parameters<NextRouter["push"]>) => void,
    windowOpen: (...args: Parameters<typeof window["open"]>) => void
}

export type Guards = {
    [url: string]: (guardParams: GuardParams) => void
}

const guards: Guards = {
    ...meinSkyGuard,
    ...salesGuard,
    // "/mein-sky/*/*": ({routerPush, allowNavigation}) => allowNavigation()
    "/mein-sky/*/*": ({routerPush, allowNavigation, windowOpen}) => routerPush("/")
}

export function RouteGuard({children}: { children: React.ReactNode }): JSX.Element | null {
    const router = useRouter();
    const [showFirstPage, setShowFirstPage] = useState(false);
    const allowFirstPage = () => {
        setShowFirstPage(true)
        resolveFirstPageAllowed()
    }

    useEffect(() => checkGuardsForFirstPage(router.pathname, guards, router, allowFirstPage), [])

    useEffect(() => {
        const callback = (url: string) => checkGuards(url, guards, router)
        router.events.on('routeChangeStart', callback);
        return () => router.events.off('routeChangeStart', callback)
    })

    return <div hidden={!showFirstPage}>{children}</div>
}

function checkGuardsForFirstPage(url: string, guards: Guards, router: NextRouter, allowFirstPage: () => void) {
    const guard = getGuard(url, guards)
    if (!guard) return allowFirstPage()

    guard({
        url,
        allowNavigation: () => allowFirstPage(),
        routerPush: (...args: Parameters<NextRouter["push"]>) => {
            const showFirstPage = () => {
                allowFirstPage(); // TODO This resolves to fast. I thought routeChangeComplete triggers after we are on new page, but it triggers and then useEffect of the old page still triggers
                router.events.off('routeChangeComplete', showFirstPage);
            }
            router.events.on('routeChangeComplete', showFirstPage)
            router.push(...args)
        },
        windowOpen: (...args: Parameters<typeof window["open"]>) => window.open(...args)
    })
}

function checkGuards(url: string, guards: Guards, router: NextRouter) {
    const guard = getGuard(url, guards)
    if (!guard) return

    guard({
        url,
        allowNavigation: () => undefined,
        routerPush: (...args: Parameters<NextRouter["push"]>) => {
            router.push(...args)
            // throw "string" is currently the only way to cancel NextJS navigations:
            // https://github.com/vercel/next.js/discussions/12348
            throw `Navigation changed from ${url} to ${args[0]} (This is not an error).`;
        },
        windowOpen: (...args: Parameters<typeof window["open"]>) => window.open(...args)
    })
}

export function getGuard(url: string, guards: Guards): Guards[keyof Guards] | undefined {
    if (url in guards) return guards[url]

    const wildcardUrls = Object.keys(guards).filter(url => url.includes("*"))
    const matchingWildcardUrl = wildcardUrls.find(wildcardUrl => !!url.match(wildcardToRegExp(wildcardUrl)))
    if (matchingWildcardUrl) return guards[matchingWildcardUrl]
}

// https://gist.github.com/donmccurdy/6d073ce2c6f3951312dfa45da14a420f
// Converts asterisks to .* expressions and escapes all other characters
export function wildcardToRegExp(s: string): RegExp {
    return new RegExp("^" + s.split(/\*+/).map(regExpEscape).join(".*") + "$");
}

// RegExp-escapes all characters in the given string
function regExpEscape(s: string): string {
    return s.replace(/[|\\{}()[\]^$+*?.]/g, "\\$&");
}

