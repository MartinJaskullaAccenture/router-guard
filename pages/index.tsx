import type { NextPage } from 'next'
import Link from "next/link";
import { useRouter } from 'next/router';

const Home: NextPage = () => {
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
