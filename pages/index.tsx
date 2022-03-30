import type { NextPage } from 'next'
import Link from "next/link";
import { useRouter } from 'next/router';

const Home: NextPage = () => {
    // useEffect -> setCMSData()
    // or setCMSData() in NextJS/LinkWrapper + spread all props in Galactica/Link.tsx <Wrapper href={LinkWrapper && target !== "_blank" ? href : undefined} scroll={scroll}>
    const router = useRouter()

    return <>
        <h1>Home</h1>
        <ul>
            <li><Link href="/sales">Sales</Link></li>
            <li><Link href="/mein-sky">Mein Sky</Link></li>
            <li>
                <button onClick={() => router.push("/sales")}>router.push(/sales)</button>
            </li>
        </ul>
    </>
}

export default Home

/*
Link is
1. Always legacy (CMS) -> <a> -> data-reload
export interface CmsLinkWithReference {
	link: CmsLink;
	reference?: CmsWebPageAsReference[];
	isLegacy: boolean; // Galactica sets <a>
}

-> Mirka will handle it in Galactica

2. Legacy site exists with same url as newCRM -> Only reload for legacy customers, not for newCRM customers
/mein

const guards: Guards = {
    ...meinSkyGuard,
    ...salesGuard,
    /mein-sky/* hardcoden
}

2. is mostly in header / footer
Check in guard the sso token if you are legacy or not
legacy -> window.open
newCrm -> router.push
undefined -> router.push(/login). props.isLoggedInProtecteed in new
 */
