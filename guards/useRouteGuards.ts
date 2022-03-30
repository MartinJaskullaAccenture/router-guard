import { useEffect } from 'react';
import { NextRouter, useRouter } from "next/router";
import { meinSkyGuard } from './meinSkyGuard';
import { salesGuard } from './salesGuard';
import { googleGuard } from './googleGuard';

export type Guards = {
    [url: string]: () => { newUrl: string, absoluteUrl?: boolean, newTab?: boolean }
}

// TODO Export registerGuards
const guards: Guards = {
    ...meinSkyGuard,
    ...salesGuard,
    ...googleGuard
}
// TODO Regular <a> and test loggedIn and pasting url. Maybe <a> not needed
// https://github.com/vercel/next.js/discussions/12348
export function useRouteGuards() {
    const router = useRouter()


    useEffect(() => {
        console.log(router.pathname)
    }, [router.pathname])

    useEffect(() => {
        const callbackNextRouter = (url: string) => validateNextRouterNavigation(url, guards, router)
        router.events.on('routeChangeStart', callbackNextRouter);
        return () => router.events.off('routeChangeStart', callbackNextRouter)
    })

    // Not sure if needed
    useEffect(() => {
        const callbackWindow = (event: BeforeUnloadEvent) => validateWindowNavigation(document.activeElement, guards, event, router)
        window.addEventListener('beforeunload', callbackWindow);
        return () => window.removeEventListener('beforeunload', callbackWindow);
    }, [])
}



function validateNextRouterNavigation(url: string, guards: Guards, router: NextRouter) {
    if (url in guards) {
        const {newUrl, absoluteUrl, newTab} = guards[url]()
        // Allow navigation
        if (newUrl === url) return
        // No navigation
        if (!newUrl) throw 'Navigation cancelled (This is not an error).';
        // Different navigation
        if (absoluteUrl) {
            window.open(newUrl, newTab ? "_blank" : "_self", "noopener");
            throw 'Navigation changed (This is not an error).';
        } else {
            router.push(newUrl)
            throw 'Navigation changed (This is not an error).';
        }
    }
}

function validateWindowNavigation(activeElement: Document["activeElement"], guards: Guards, event: BeforeUnloadEvent, router: NextRouter) {
    if (document.activeElement instanceof HTMLAnchorElement) {
        const link = document.activeElement
        const href = link.href
        if (href in guards) {
            const {newUrl, absoluteUrl, newTab} = guards[href]()
            // Allow navigation
            if (href === newUrl) return
            event.preventDefault();
            // No navigation
            if (!newUrl) return;
            // Different navigation
            if (absoluteUrl) {
                const target = new Map().set(undefined, link.target).set(true, "_blank").set(false, "_self").get(newTab)
                window.open(newUrl, target, "noopener");
                throw 'Navigation changed (This is not an error).';
            } else {
                throw 'Navigation changed (This is not an error).';
            }
        }
    }
}
