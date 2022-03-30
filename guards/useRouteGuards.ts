import { useEffect } from 'react';
import { NextRouter, useRouter } from "next/router";
import { meinSkyGuard } from './meinSkyGuard';
import { salesGuard } from './salesGuard';
import { googleGuard } from './googleGuard';

export type Guards = {
    [url: string]: () => string
}

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
        const callbackNextRouter = (url: string) => navigateNext(url, guards, router)
        router.events.on('routeChangeStart', callbackNextRouter);
        return () => router.events.off('routeChangeStart', callbackNextRouter)
    }, [router.pathname])

    // Not sure if needed
    useEffect(() => {
        const callbackWindow = (event: BeforeUnloadEvent) => navigateWindow(document.activeElement, guards, event)
        window.addEventListener('beforeunload', callbackWindow);
        return () => window.removeEventListener('beforeunload', callbackWindow);
    }, [])
}

function navigateNext(url: string, guards: Guards, router: NextRouter) {
    if (url in guards) {
        const redirectionUrl = guards[url]()
        // Allow navigation
        if (url === redirectionUrl) return
        // No navigation
        if (!redirectionUrl) throw 'Abort route change. Please ignore this error.';
        // Different navigation
        router.replace(redirectionUrl)
    }
}

function navigateWindow(activeElement: Document["activeElement"], guards: Guards, event: BeforeUnloadEvent) {
    if (document.activeElement instanceof HTMLAnchorElement) {
        debugger
        const link = document.activeElement
        const href = link.href
        if (href in guards) {
            const redirectionUrl = guards[href]() // TODO Maybe better to pass in NextRouter and let the guard handle navigation
            // Allow navigation
            if (href === redirectionUrl) return
            event.preventDefault();
            // No navigation
            if (!redirectionUrl) return;
            // Different navigation
            window.open(redirectionUrl, link.target, "noopener");
        }
    }
}
